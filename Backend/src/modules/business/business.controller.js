const businessService = require('./business.service');
const cloudinary = require('../../config/cloudinary');

const registerBusiness = async (req, res, next) => {
    try {
        const { name, address, totalSlots, price } = req.body;
        const ownerId = req.user.id;
        
        let imageUrl = null;
        if (req.file) {
            // Upload to Cloudinary using stream for efficiency with memory storage
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'parking_businesses' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
            imageUrl = uploadResult.secure_url;
        }

        const business = await businessService.createBusiness(ownerId, name, address, totalSlots, price, imageUrl);

        res.status(201).json({
            success: true,
            message: 'Business registered successfully and is pending approval',
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
        const { limit, offset, search } = req.query;
        const businesses = await businessService.getAllApprovedBusinesses(limit, offset, search);

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
        const { name, address, totalSlots, price } = req.body;
        const ownerId = req.user.id;

        const business = await businessService.getBusinessById(id);
        if (!business) {
            return res.status(404).json({ success: false, message: 'Business not found' });
        }

        if (business.owner_id !== ownerId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        let imageUrl = null;
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'parking_businesses' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
            imageUrl = uploadResult.secure_url;
        }

        const updated = await businessService.updateBusinessDetails(id, { name, address, totalSlots, price, imageUrl });

        res.status(200).json({
            success: true,
            message: 'Business updated successfully',
            data: updated
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
