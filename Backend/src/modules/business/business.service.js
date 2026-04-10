const db = require('../../config/db');

const createBusiness = async (ownerId, name, address, totalSlots, price) => {
    const query = `
        INSERT INTO businesses (owner_id, name, address, total_slots, price_per_hour, status)
        VALUES ($1, $2, $3, $4, $5, 'pending')
        RETURNING *
    `;
    const values = [ownerId, name, address, totalSlots, price];
    const { rows } = await db.query(query, values);
    return rows[0];
};

const getBusinessesByOwner = async (ownerId) => {
    const query = 'SELECT * FROM businesses WHERE owner_id = $1';
    const { rows } = await db.query(query, [ownerId]);
    return rows;
};

const getAllApprovedBusinesses = async (limit = 10, offset = 0) => {
    const query = `
        SELECT * FROM businesses 
        WHERE status = 'approved' 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
    `;
    const { rows } = await db.query(query, [limit, offset]);
    return rows;
};

const getBusinessById = async (id) => {
    const query = 'SELECT * FROM businesses WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

const updateBusinessStatus = async (id, status) => {
    const query = 'UPDATE businesses SET status = $1 WHERE id = $2 RETURNING *';
    const { rows } = await db.query(query, [status, id]);
    return rows[0];
};

const updateBusinessDetails = async (id, name, address, price) => {
    const query = `
        UPDATE businesses 
        SET name = $1, address = $2, price_per_hour = $3 
        WHERE id = $4 
        RETURNING *
    `;
    const { rows } = await db.query(query, [name, address, price, id]);
    return rows[0];
};

module.exports = {
    createBusiness,
    getBusinessesByOwner,
    getAllApprovedBusinesses,
    getBusinessById,
    updateBusinessStatus,
    updateBusinessDetails
};
