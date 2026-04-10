const slotsService = require('./slots.service');
const businessService = require('../business/business.service');

const addSlots = async (req, res, next) => {
    try {
        const { businessId, slotNumbers } = req.body;
        const ownerId = req.user.id;

        const business = await businessService.getBusinessById(businessId);
        if (!business) {
            return res.status(404).json({ success: false, message: 'Business not found' });
        }

        if (business.owner_id !== ownerId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to add slots to this business' });
        }

        const slots = await slotsService.createSlots(businessId, slotNumbers);

        res.status(201).json({
            success: true,
            message: `${slots.length} slots added successfully`,
            data: slots
        });
    } catch (error) {
        next(error);
    }
};

const listSlots = async (req, res, next) => {
    try {
        const { businessId } = req.params;
        const slots = await slotsService.getSlotsByBusiness(businessId);

        res.status(200).json({
            success: true,
            data: slots
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addSlots,
    listSlots
};
