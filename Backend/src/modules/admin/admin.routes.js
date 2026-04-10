const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { authMiddleware, roleMiddleware } = require('../../middlewares/auth.middleware');

// All admin routes are protected
router.use(authMiddleware, roleMiddleware(['admin']));

// @route   GET api/admin/businesses
// @desc    Get all businesses
router.get('/businesses', adminController.getBusinesses);

// @route   GET api/admin/users
// @desc    Get all users
router.get('/users', adminController.getUsers);

// @route   PUT api/admin/businesses/:id/status
// @desc    Approve or reject a business
router.put('/businesses/:id/status', adminController.approveBusiness);

module.exports = router;
