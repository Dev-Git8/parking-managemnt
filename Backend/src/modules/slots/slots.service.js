const prisma = require('../../config/prisma');
const { redisClient, isRedisConnected } = require('../../config/redis');
const { getIO } = require('../../config/socket');

const emitSlotsUpdated = (businessId) => {
    try {
        const io = getIO();
        io.to(`business_${businessId}`).emit('slotsUpdated', { businessId });
    } catch (err) {
        console.error('Failed to emit slotsUpdated event:', err.message);
    }
};

const invalidateSlotsCache = async (businessId) => {
    if (!isRedisConnected()) return;
    try {
        await redisClient.del(`slots:${businessId}`);
    } catch (err) {
        console.error('Failed to invalidate Redis cache:', err.message);
    }
};

const createSlots = async (businessId, slots) => {
    // slots is an array of slot numbers e.g. ['A1', 'A2']
    const createdSlots = [];
    
    await prisma.$transaction(async (tx) => {
        for (const slotNumber of slots) {
            try {
                const slot = await tx.slot.create({
                    data: {
                        businessId: parseInt(businessId),
                        slotNumber,
                        isAvailable: true,
                    },
                });
                createdSlots.push(slot);
            } catch (err) {
                // Ignore duplicates (P2002 is Prisma's unique constraint error code)
                if (err.code !== 'P2002') throw err;
            }
        }
    });

    if (createdSlots.length > 0) {
        await invalidateSlotsCache(businessId);
        emitSlotsUpdated(businessId);
    }

    return createdSlots;
};

const getSlotsByBusiness = async (businessId) => {
    if (isRedisConnected()) {
        try {
            const cachedSlots = await redisClient.get(`slots:${businessId}`);
            if (cachedSlots) {
                return JSON.parse(cachedSlots);
            }
        } catch (err) {
            console.error('Redis GET Error:', err);
        }
    }

    const rows = await prisma.slot.findMany({
        where: { businessId: parseInt(businessId) },
        orderBy: [
            { slotNumber: 'asc' } // Prisma sorting is slightly different than SQL LENGTH, but 'asc' is a good start
        ],
    });

    // Custom sort to match SQL "ORDER BY LENGTH(slot_number), slot_number"
    const sortedRows = rows.sort((a, b) => 
        a.slotNumber.length - b.slotNumber.length || a.slotNumber.localeCompare(b.slotNumber)
    );

    if (isRedisConnected()) {
        try {
            await redisClient.setEx(`slots:${businessId}`, 3600, JSON.stringify(sortedRows));
        } catch (err) {
            console.error('Redis SET Error:', err);
        }
    }

    return sortedRows;
};

const updateSlotAvailability = async (slotId, isAvailable) => {
    const updatedSlot = await prisma.slot.update({
        where: { id: parseInt(slotId) },
        data: { isAvailable },
    });
    
    if (updatedSlot) {
        await invalidateSlotsCache(updatedSlot.businessId);
        emitSlotsUpdated(updatedSlot.businessId);
    }

    return updatedSlot;
};

const deleteSlot = async (slotId, ownerId) => {
    const slot = await prisma.slot.findUnique({
        where: { id: parseInt(slotId) },
        include: {
            business: true,
            bookings: {
                where: {
                    status: { in: ['booked', 'overdue'] }
                }
            }
        }
    });

    if (!slot) {
        throw new Error('Slot not found');
    }

    if (slot.business.ownerId !== parseInt(ownerId)) {
        throw new Error('Unauthorized to delete this slot');
    }

    if (!slot.isAvailable) {
        throw new Error('Cannot delete an occupied slot');
    }

    if (slot.bookings.length > 0) {
        throw new Error('Slot has an active booking and cannot be deleted');
    }

    const deletedSlot = await prisma.slot.delete({
        where: { id: parseInt(slotId) },
    });

    if (deletedSlot) {
        await invalidateSlotsCache(deletedSlot.businessId);
        emitSlotsUpdated(deletedSlot.businessId);
    }

    return true;
};

module.exports = {
    createSlots,
    getSlotsByBusiness,
    updateSlotAvailability,
    deleteSlot
};
