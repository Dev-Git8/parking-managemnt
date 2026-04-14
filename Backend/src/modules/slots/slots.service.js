const db = require('../../config/db');
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
    const query = `
        INSERT INTO slots (business_id, slot_number, is_available)
        VALUES ($1, $2, TRUE)
        ON CONFLICT (business_id, slot_number) DO NOTHING
        RETURNING *
    `;
    
    const createdSlots = [];
    for (const slotNumber of slots) {
        const { rows } = await db.query(query, [businessId, slotNumber]);
        if (rows[0]) createdSlots.push(rows[0]);
    }

    if (createdSlots.length > 0) {
        await invalidateSlotsCache(businessId);
        emitSlotsUpdated(businessId);
    }

    return createdSlots;
};

const getSlotsByBusiness = async (businessId) => {
    if (isRedisConnected()) {
        try {
            // Try to get from Cache
            const cachedSlots = await redisClient.get(`slots:${businessId}`);
            if (cachedSlots) {
                return JSON.parse(cachedSlots);
            }
        } catch (err) {
            console.error('Redis GET Error:', err);
        }
    }

    const query = 'SELECT * FROM slots WHERE business_id = $1 ORDER BY LENGTH(slot_number), slot_number';
    const { rows } = await db.query(query, [businessId]);

    if (isRedisConnected()) {
        try {
            // Save to Cache for 1 hour (3600 seconds)
            await redisClient.setEx(`slots:${businessId}`, 3600, JSON.stringify(rows));
        } catch (err) {
            console.error('Redis SET Error:', err);
        }
    }

    return rows;
};

const updateSlotAvailability = async (slotId, isAvailable) => {
    const query = 'UPDATE slots SET is_available = $1 WHERE id = $2 RETURNING *';
    const { rows } = await db.query(query, [isAvailable, slotId]);
    
    if (rows[0]) {
        await invalidateSlotsCache(rows[0].business_id);
        emitSlotsUpdated(rows[0].business_id);
    }

    return rows[0];
};

const deleteSlot = async (slotId, ownerId) => {
    // 1. Check ownership and slot existence
    const checkQuery = `
        SELECT s.*, b.owner_id 
        FROM slots s
        JOIN businesses b ON s.business_id = b.id
        WHERE s.id = $1
    `;
    const { rows: slotRows } = await db.query(checkQuery, [slotId]);

    if (slotRows.length === 0) {
        throw new Error('Slot not found');
    }

    const slot = slotRows[0];
    if (slot.owner_id !== ownerId) {
        throw new Error('Unauthorized to delete this slot');
    }

    // 2. Check if slot is available (not occupied)
    if (!slot.is_available) {
        throw new Error('Cannot delete an occupied slot');
    }

    // 3. Check for active or overdue bookings (extra safety)
    const bookingCheckQuery = `
        SELECT id FROM bookings 
        WHERE slot_id = $1 AND status IN ('booked', 'overdue')
    `;
    const { rows: bookingRows } = await db.query(bookingCheckQuery, [slotId]);
    if (bookingRows.length > 0) {
        throw new Error('Slot has an active booking and cannot be deleted');
    }

    // 4. Delete the slot
    const deleteQuery = 'DELETE FROM slots WHERE id = $1 RETURNING business_id';
    const { rows: deleteRows } = await db.query(deleteQuery, [slotId]);

    if (deleteRows[0]) {
        await invalidateSlotsCache(deleteRows[0].business_id);
        emitSlotsUpdated(deleteRows[0].business_id);
    }

    return true;
};

module.exports = {
    createSlots,
    getSlotsByBusiness,
    updateSlotAvailability,
    deleteSlot
};
