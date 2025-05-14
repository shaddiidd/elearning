const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

// User registration route
router.post('/register', authController.register);

// User login route
router.post('/login', authController.login);

// Get user session information
router.get('/session', authMiddleware, authController.getSession);

// Change password route
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;