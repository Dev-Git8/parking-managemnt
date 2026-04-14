const db = require('../../config/db');

const createBusiness = async (ownerId, name, address, totalSlots, price, imageUrl = null) => {
    const query = `
        INSERT INTO businesses (owner_id, name, address, total_slots, price_per_hour, status, image_url)
        VALUES ($1, $2, $3, $4, $5, 'pending', $6)
        RETURNING *
    `;
    const values = [ownerId, name, address, totalSlots, price, imageUrl];
    const { rows } = await db.query(query, values);
    return rows[0];
};

const getBusinessesByOwner = async (ownerId) => {
    const query = 'SELECT * FROM businesses WHERE owner_id = $1';
    const { rows } = await db.query(query, [ownerId]);
    return rows;
};

const getAllApprovedBusinesses = async (limit = 10, offset = 0, searchTerm = '') => {
    let query = `
        SELECT * FROM businesses 
        WHERE status = 'approved' 
    `;
    const params = [limit, offset];

    if (searchTerm) {
        query += ` AND (name ILIKE $3 OR address ILIKE $3) `;
        params.push(`%${searchTerm}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $1 OFFSET $2 `;
    
    const { rows } = await db.query(query, params);
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

const updateBusinessDetails = async (id, { name, address, totalSlots, price, imageUrl }) => {
    const query = `
        UPDATE businesses 
        SET name = COALESCE($1, name), 
            address = COALESCE($2, address), 
            total_slots = COALESCE($3, total_slots), 
            price_per_hour = COALESCE($4, price_per_hour),
            image_url = COALESCE($5, image_url)
        WHERE id = $6 
        RETURNING *
    `;
    const values = [name, address, totalSlots, price, imageUrl, id];
    const { rows } = await db.query(query, values);
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
