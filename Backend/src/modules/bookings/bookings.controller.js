const bookingsService = require('./bookings.service');

const createBooking = async (req, res, next) => {
    try {
        const { businessId, slotId, startTime, endTime, totalPrice } = req.body;
        const userId = req.user.id;

        const booking = await bookingsService.createBookingTransaction(
            userId, 
            businessId, 
            slotId, 
            startTime, 
            endTime, 
            totalPrice
        );

        res.status(201).json({
            success: true,
            message: 'Booking confirmed',
            data: booking
        });
    } catch (error) {
        if (error.message === 'Slot is already booked' || error.message === 'Slot not found') {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
};

const cancelBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await bookingsService.cancelBookingTransaction(id, userId);

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        if (error.message === 'Booking not found' || error.message === 'Unauthorized' || error.message === 'Already cancelled') {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
};

const getMyBookings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookings = await bookingsService.getBookingsByUser(userId);

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

const getBusinessBookings = async (req, res, next) => {
    try {
        const { businessId } = req.params;
        const bookings = await bookingsService.getBookingsByBusiness(businessId);

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    cancelBooking,
    getMyBookings,
    getBusinessBookings
};
