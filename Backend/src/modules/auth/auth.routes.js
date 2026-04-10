const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Login user & get access token
// @access  Public
router.post('/login', authController.login);

// @route   POST api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', authController.refresh);

// @route   POST api/auth/logout
// @desc    Logout user & clear cookie
// @access  Public
router.post('/logout', authController.logout);

module.exports = router;
