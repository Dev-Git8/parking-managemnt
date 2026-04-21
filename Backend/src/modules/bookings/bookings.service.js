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

const createBookingTransaction = async (userId, businessId, slotId, startTime, endTime, totalPrice) => {
    return await prisma.$transaction(async (tx) => {
        // 1. Lock the slot row and check availability using raw SQL for FOR UPDATE
        const slotRows = await tx.$queryRaw`
            SELECT id, business_id as "businessId", slot_number as "slotNumber", is_available as "isAvailable" 
            FROM slots 
            WHERE id = ${parseInt(slotId)} 
            FOR UPDATE
        `;
        
        if (slotRows.length === 0) {
            throw new Error('Slot not found');
        }

        const slot = slotRows[0];
        if (!slot.isAvailable) {
            throw new Error('Slot is already booked');
        }

        // 2. Create the booking
        const booking = await tx.booking.create({
            data: {
                userId: parseInt(userId),
                businessId: parseInt(businessId),
                slotId: parseInt(slotId),
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                totalPrice: parseFloat(totalPrice),
                status: 'booked',
            },
        });

        // 3. Mark slot as unavailable
        await tx.slot.update({
            where: { id: parseInt(slotId) },
            data: { isAvailable: false },
        });

        // Socket and Cache updates (after transaction success)
        // Note: These happen after the transaction block returns
        return booking;
    }).then(async (booking) => {
        await invalidateSlotsCache(businessId);
        emitSlotsUpdated(businessId);
        return booking;
    });
};

const cancelBookingTransaction = async (bookingId, userId) => {
    return await prisma.$transaction(async (tx) => {
        // 1. Find the booking with a lock
        const bookingRows = await tx.$queryRaw`
            SELECT id, user_id as "userId", business_id as "businessId", slot_id as "slotId", status 
            FROM bookings 
            WHERE id = ${parseInt(bookingId)} 
            FOR UPDATE
        `;
        
        if (bookingRows.length === 0) {
            throw new Error('Booking not found');
        }

        const booking = bookingRows[0];
        
        if (booking.userId !== parseInt(userId)) {
            throw new Error('Unauthorized to cancel this booking');
        }

        if (booking.status === 'cancelled') {
            throw new Error('Booking is already cancelled');
        }

        // 2. Update booking status
        const updatedBooking = await tx.booking.update({
            where: { id: parseInt(bookingId) },
            data: { status: 'cancelled' },
        });

        // 3. Mark slot as available again
        await tx.slot.update({
            where: { id: booking.slotId },
            data: { isAvailable: true },
        });

        return updatedBooking;
    }).then(async (booking) => {
        await invalidateSlotsCache(booking.businessId);
        emitSlotsUpdated(booking.businessId);
        return booking;
    });
};

const getBookingsByUser = async (userId) => {
    return await prisma.booking.findMany({
        where: { userId: parseInt(userId) },
        include: {
            slot: { select: { slotNumber: true } },
            business: { select: { name: true, address: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
};

const getBookingsByBusiness = async (businessId) => {
    return await prisma.booking.findMany({
        where: { businessId: parseInt(businessId) },
        include: {
            slot: { select: { slotNumber: true } },
            user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
};

const terminateBookingTransaction = async (bookingId, userId) => {
    return await prisma.$transaction(async (tx) => {
        // 1. Find the booking with its business details
        const booking = await tx.booking.findUnique({
            where: { id: parseInt(bookingId) },
            include: { business: true }
        });
        
        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.userId !== parseInt(userId)) {
            throw new Error('Unauthorized');
        }

        if (booking.status === 'completed' || booking.status === 'cancelled') {
            throw new Error('Already terminated');
        }

        const now = new Date();
        const endTime = new Date(booking.endTime);
        
        let penaltyAmount = 0;
        if (now > endTime) {
            const diffMs = now - endTime;
            const diffMins = Math.ceil(diffMs / (1000 * 60));
            const penaltyHourlyRate = parseFloat(booking.business.pricePerHour) * 1.5;
            penaltyAmount = (diffMins / 60) * penaltyHourlyRate;
            penaltyAmount = Math.round(penaltyAmount * 100) / 100;
        }

        // 2. Update booking status
        const updatedBooking = await tx.booking.update({
            where: { id: parseInt(bookingId) },
            data: {
                status: 'completed',
                actualEndTime: now,
                penaltyAmount: penaltyAmount,
            },
        });

        // 3. Mark slot as available again
        await tx.slot.update({
            where: { id: booking.slotId },
            data: { isAvailable: true },
        });

        return updatedBooking;
    }).then(async (booking) => {
        await invalidateSlotsCache(booking.businessId);
        emitSlotsUpdated(booking.businessId);
        return booking;
    });
};

module.exports = {
    createBookingTransaction,
    cancelBookingTransaction,
    getBookingsByUser,
    getBookingsByBusiness,
    terminateBookingTransaction
};
