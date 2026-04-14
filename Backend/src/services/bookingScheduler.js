const db = require('../config/db');
const { redisClient, isRedisConnected } = require('../config/redis');
const { getIO } = require('../config/socket');

const CHECK_INTERVAL_MS = 30 * 1000; // Check every 30 seconds
let intervalId = null;

const emitSlotsUpdated = (businessId) => {
    try {
        const io = getIO();
        io.to(`business_${businessId}`).emit('slotsUpdated', { businessId });
    } catch (err) {
        console.error('[Scheduler] Failed to emit slotsUpdated:', err.message);
    }
};

const invalidateSlotsCache = async (businessId) => {
    if (!isRedisConnected()) return;
    try {
        await redisClient.del(`slots:${businessId}`);
    } catch (err) {
        console.error('[Scheduler] Failed to invalidate cache:', err.message);
    }
};

/**
 * Finds all bookings whose end_time has passed and are still marked as 'booked'.
 * Marks them as 'completed' and frees up the corresponding parking slot.
 * Emits real-time WebSocket events so the UI updates instantly.
 */
const expireBookings = async () => {
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Find all expired bookings that are still active
        const expiredQuery = `
            SELECT b.id, b.slot_id, b.business_id
            FROM bookings b
            WHERE b.status = 'booked'
              AND b.end_time <= NOW()
            FOR UPDATE
        `;
        const { rows: expiredBookings } = await client.query(expiredQuery);

        if (expiredBookings.length === 0) {
            await client.query('COMMIT');
            return;
        }

        console.log(`[Scheduler] Found ${expiredBookings.length} overdue booking(s). Awaiting manual termination...`);

        // Collect unique business IDs to notify (only if status changed to 'overdue')
        const affectedBusinessIds = new Set();

        for (const booking of expiredBookings) {
            // Update status to 'overdue' instead of 'completed'
            // This allows the UI to show a warning without freeing the slot
            await client.query(
                "UPDATE bookings SET status = 'overdue' WHERE id = $1",
                [booking.id]
            );

            affectedBusinessIds.add(booking.business_id);
        }

        await client.query('COMMIT');

        // Invalidate cache and emit WebSocket events for each affected business
        // to show 'overdue' status in UI
        for (const businessId of affectedBusinessIds) {
            await invalidateSlotsCache(businessId);
            emitSlotsUpdated(businessId);
        }

        console.log(`[Scheduler] Successfully freed ${expiredBookings.length} slot(s).`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('[Scheduler] Error expiring bookings:', error.message);
    } finally {
        client.release();
    }
};

/**
 * Starts the background scheduler that checks for expired bookings.
 */
const startBookingScheduler = () => {
    console.log(`[Scheduler] Booking expiration scheduler started (checking every ${CHECK_INTERVAL_MS / 1000}s)`);

    // Run once immediately on startup to catch any bookings that expired while server was down
    expireBookings();

    // Then run on a regular interval
    intervalId = setInterval(expireBookings, CHECK_INTERVAL_MS);
};

/**
 * Stops the background scheduler (useful for graceful shutdown).
 */
const stopBookingScheduler = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('[Scheduler] Booking expiration scheduler stopped.');
    }
};

module.exports = {
    startBookingScheduler,
    stopBookingScheduler
};
