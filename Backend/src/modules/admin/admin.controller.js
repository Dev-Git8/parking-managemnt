const adminService = require('./admin.service');

const getBusinesses = async (req, res, next) => {
    try {
        const businesses = await adminService.getAllBusinesses();
        res.status(200).json({ success: true, data: businesses });
    } catch (error) {
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

const approveBusiness = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const business = await adminService.updateBusinessStatus(id, status);
        res.status(200).json({ success: true, message: `Business ${status}`, data: business });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBusinesses,
    getUsers,
    approveBusiness
};
