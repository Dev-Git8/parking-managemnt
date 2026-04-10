const db = require('../../config/db');

const getAllBusinesses = async () => {
    const query = `
        SELECT b.*, u.name as owner_name, u.email as owner_email 
        FROM businesses b
        JOIN users u ON b.owner_id = u.id
        ORDER BY b.created_at DESC
    `;
    const { rows } = await db.query(query);
    return rows;
};

const getAllUsers = async () => {
    const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
    const { rows } = await db.query(query);
    return rows;
};

const updateBusinessStatus = async (id, status) => {
    const query = 'UPDATE businesses SET status = $1 WHERE id = $2 RETURNING *';
    const { rows } = await db.query(query, [status, id]);
    return rows[0];
};

module.exports = {
    getAllBusinesses,
    getAllUsers,
    updateBusinessStatus
};
