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

    const query = 'SELECT * FROM slots WHERE business_id = $1 ORDER BY slot_number';
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

module.exports = {
    createSlots,
    getSlotsByBusiness,
    updateSlotAvailability
};
