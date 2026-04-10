const db = require('../../config/db');

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
    return createdSlots;
};

const getSlotsByBusiness = async (businessId) => {
    const query = 'SELECT * FROM slots WHERE business_id = $1 ORDER BY slot_number';
    const { rows } = await db.query(query, [businessId]);
    return rows;
};

const updateSlotAvailability = async (slotId, isAvailable) => {
    const query = 'UPDATE slots SET is_available = $1 WHERE id = $2 RETURNING *';
    const { rows } = await db.query(query, [isAvailable, slotId]);
    return rows[0];
};

module.exports = {
    createSlots,
    getSlotsByBusiness,
    updateSlotAvailability
};
