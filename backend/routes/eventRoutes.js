const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent } = require('../controllers/eventController');
const { authGuard, roleGuard } = require('../middleware/authGuard');

// GET /api/v1/events - Public (Required by Task 3)
router.get('/', getEvents);

// GET /api/v1/events/:id - Public
router.get('/:id', getEventById);

// POST /api/v1/events - Protected (Organizer or Admin can create events)
router.post('/', authGuard, createEvent);

module.exports = router;
