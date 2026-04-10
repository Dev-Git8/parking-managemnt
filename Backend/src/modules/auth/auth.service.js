const db = require('../../config/db');
const bcrypt = require('bcrypt');

const createUser = async (name, email, password, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at
    `;
    const values = [name, email, hashedPassword, role];
    const { rows } = await db.query(query, values);
    return rows[0];
};

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    return rows[0];
};

const findUserById = async (id) => {
    const query = 'SELECT id, name, email, role FROM users WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

const updateRefreshToken = async (userId, token) => {
    const query = 'UPDATE users SET refresh_token = $1 WHERE id = $2';
    await db.query(query, [token, userId]);
};

const clearRefreshToken = async (userId) => {
    const query = 'UPDATE users SET refresh_token = NULL WHERE id = $1';
    await db.query(query, [userId]);
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateRefreshToken,
    clearRefreshToken,
};
