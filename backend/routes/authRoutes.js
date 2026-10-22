const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// POST /api/v1/auth/login (Public) - Required by Task 3
router.post('/login', login);

// POST /api/v1/auth/register (Public helper)
router.post('/register', register);

module.exports = router;
