const express = require('express');
const router = express.Router();
const {
  bookTicket,
  getMyTickets,
  updateTicketStatus,
} = require('../controllers/ticketController');
const { authGuard } = require('../middleware/authGuard');

// Apply authGuard to all ticket routes
router.use(authGuard);

// POST /api/v1/tickets - Book tickets (Task 3 & 5)
router.post('/', bookTicket);

// GET /api/v1/tickets/my - Get attendee's tickets (Task 3 & 5)
router.get('/my', getMyTickets);

// PATCH /api/v1/tickets/:id/status - Update ticket status (Task 3)
router.patch('/:id/status', updateTicketStatus);

module.exports = router;
