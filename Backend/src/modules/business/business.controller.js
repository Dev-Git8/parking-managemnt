const businessService = require('./business.service');

const registerBusiness = async (req, res, next) => {
    try {
        const { name, address, totalSlots, price } = req.body;
        const ownerId = req.user.id;

        const business = await businessService.createBusiness(ownerId, name, address, totalSlots, price);

        res.status(201).json({
            success: true,
            message: 'Business registered and pending approval',
            data: business
        });
    } catch (error) {
        next(error);
    }
};

const getMyBusinesses = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const businesses = await businessService.getBusinessesByOwner(ownerId);

        res.status(200).json({
            success: true,
            data: businesses
        });
    } catch (error) {
        next(error);
    }
};

const getAllApproved = async (req, res, next) => {
    try {
        const { limit, offset } = req.query;
        const businesses = await businessService.getAllApprovedBusinesses(limit, offset);

        res.status(200).json({
            success: true,
            data: businesses
        });
    } catch (error) {
        next(error);
    }
};

const updateBusiness = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, address, price } = req.body;
        const ownerId = req.user.id;

        const business = await businessService.getBusinessById(id);
        if (!business) {
            return res.status(404).json({ success: false, message: 'Business not found' });
        }

        if (business.owner_id !== ownerId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this business' });
        }

        const updatedBusiness = await businessService.updateBusinessDetails(id, name, address, price);

        res.status(200).json({
            success: true,
            message: 'Business updated successfully',
            data: updatedBusiness
        });
    } catch (error) {
        next(error);
    }
};

const getSingleBusiness = async (req, res, next) => {
    try {
        const { id } = req.params;
        const business = await businessService.getBusinessById(id);
        
        if (!business) {
            return res.status(404).json({ success: false, message: 'Business not found' });
        }

        res.status(200).json({
            success: true,
            data: business
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerBusiness,
    getMyBusinesses,
    getAllApproved,
    updateBusiness,
    getSingleBusiness
};
