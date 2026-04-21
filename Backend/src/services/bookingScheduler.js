const prisma = require('../config/prisma');
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

const expireBookings = async () => {
    try {
        const affectedBusinessIds = await prisma.$transaction(async (tx) => {
            // 1. Find all expired bookings using raw SQL for locking
            const expiredBookings = await tx.$queryRaw`
                SELECT id, slot_id as "slotId", business_id as "businessId"
                FROM bookings
                WHERE status = 'booked'
                  AND end_time <= NOW()
                FOR UPDATE
            `;

            if (expiredBookings.length === 0) {
                return [];
            }

            console.log(`[Scheduler] Found ${expiredBookings.length} overdue booking(s). Marking as overdue...`);

            const businessIds = new Set();
            for (const booking of expiredBookings) {
                await tx.booking.update({
                    where: { id: booking.id },
                    data: { status: 'overdue' },
                });
                businessIds.add(booking.businessId);
            }

            return Array.from(businessIds);
        });

        if (affectedBusinessIds.length > 0) {
            for (const businessId of affectedBusinessIds) {
                await invalidateSlotsCache(businessId);
                emitSlotsUpdated(businessId);
            }
            console.log(`[Scheduler] Processed ${affectedBusinessIds.length} businesses.`);
        }
    } catch (error) {
        console.error('[Scheduler] Error expiring bookings:', error.message);
    }
};

const startBookingScheduler = () => {
    console.log(`[Scheduler] Booking expiration scheduler started (checking every ${CHECK_INTERVAL_MS / 1000}s)`);
    expireBookings();
    intervalId = setInterval(expireBookings, CHECK_INTERVAL_MS);
};

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
