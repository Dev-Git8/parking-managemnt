const db = require('../../config/db');

const createBookingTransaction = async (userId, businessId, slotId, startTime, endTime, totalPrice) => {
    const client = await db.pool.connect();
    
    try {
        await client.query('BEGIN');

        // 1. Lock the slot row and check availability
        const slotQuery = 'SELECT * FROM slots WHERE id = $1 FOR UPDATE';
        const { rows: slotRows } = await client.query(slotQuery, [slotId]);
        
        if (slotRows.length === 0) {
            throw new Error('Slot not found');
        }

        const slot = slotRows[0];
        if (!slot.is_available) {
            throw new Error('Slot is already booked');
        }

        // 2. Create the booking
        const bookingQuery = `
            INSERT INTO bookings (user_id, business_id, slot_id, start_time, end_time, total_price, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'booked')
            RETURNING *
        `;
        const bookingValues = [userId, businessId, slotId, startTime, endTime, totalPrice];
        const { rows: bookingRows } = await client.query(bookingQuery, bookingValues);
        const booking = bookingRows[0];

        // 3. Mark slot as unavailable
        const updateSlotQuery = 'UPDATE slots SET is_available = FALSE WHERE id = $1';
        await client.query(updateSlotQuery, [slotId]);

        await client.query('COMMIT');
        return booking;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const cancelBookingTransaction = async (bookingId, userId) => {
    const client = await db.pool.connect();
    
    try {
        await client.query('BEGIN');

        // 1. Find the booking
        const bookingQuery = 'SELECT * FROM bookings WHERE id = $1 FOR UPDATE';
        const { rows: bookingRows } = await client.query(bookingQuery, [bookingId]);
        
        if (bookingRows.length === 0) {
            throw new Error('Booking not found');
        }

        const booking = bookingRows[0];
        
        // Ensure user is the owner or an admin (admin check can be added later)
        if (booking.user_id !== userId) {
            throw new Error('Unauthorized to cancel this booking');
        }

        if (booking.status === 'cancelled') {
            throw new Error('Booking is already cancelled');
        }

        // 2. Update booking status
        const updateBookingQuery = "UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *";
        await client.query(updateBookingQuery, [bookingId]);

        // 3. Mark slot as available again
        const updateSlotQuery = 'UPDATE slots SET is_available = TRUE WHERE id = $1';
        await client.query(updateSlotQuery, [booking.slot_id]);

        await client.query('COMMIT');
        return booking;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const getBookingsByUser = async (userId) => {
    const query = `
        SELECT b.*, s.slot_number, biz.name as business_name, biz.address as business_address
        FROM bookings b
        JOIN slots s ON b.slot_id = s.id
        JOIN businesses biz ON b.business_id = biz.id
        WHERE b.user_id = $1
        ORDER BY b.created_at DESC
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
};

const getBookingsByBusiness = async (businessId) => {
    const query = `
        SELECT b.*, s.slot_number, u.name as user_name, u.email as user_email
        FROM bookings b
        JOIN slots s ON b.slot_id = s.id
        JOIN users u ON b.user_id = u.id
        WHERE b.business_id = $1
        ORDER BY b.created_at DESC
    `;
    const { rows } = await db.query(query, [businessId]);
    return rows;
};

module.exports = {
    createBookingTransaction,
    cancelBookingTransaction,
    getBookingsByUser,
    getBookingsByBusiness
};
