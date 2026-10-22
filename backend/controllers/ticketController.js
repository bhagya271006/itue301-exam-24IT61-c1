const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

/**
 * @desc    Book tickets for an event
 * @route   POST /api/v1/tickets
 * @access  Protected (Requires Bearer token via authGuard)
 * Required by Task 3 & Task 5
 */
const bookTicket = async (req, res, next) => {
  try {
    const { eventId, quantity } = req.body;
    const attendeeId = req.user.id; // Extracted from authGuard JWT payload

    // 1. Validate inputs
    if (!eventId) {
      return res.status(400).json({
        success: false,
        error: 'Event ID is required',
      });
    }

    const qty = Number(quantity);
    if (!qty || qty < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1',
      });
    }

    // 2. Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: `Event not found with ID ${eventId}`,
      });
    }

    // 3. Validate ticketsAvailable >= quantity (Task 5 requirement)
    if (event.ticketsAvailable < qty) {
      return res.status(400).json({
        success: false,
        error: `Insufficient tickets available. Only ${event.ticketsAvailable} remaining, but ${qty} requested.`,
        ticketsAvailable: event.ticketsAvailable,
      });
    }

    // 4. Create the Ticket document
    const ticket = await Ticket.create({
      attendeeId,
      eventId,
      quantity: qty,
      bookingDate: new Date(),
      status: 'booked',
    });

    // 5. Decrement event's ticketsAvailable
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $inc: { ticketsAvailable: -qty } },
      { new: true, runValidators: true }
    );

    // Populate for clean response
    await ticket.populate([
      { path: 'attendeeId', select: 'name email' },
      { path: 'eventId', select: 'title date venue ticketsAvailable' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Ticket booked successfully',
      data: ticket,
      remainingTickets: updatedEvent.ticketsAvailable,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get attendee's own tickets
 * @route   GET /api/v1/tickets/my
 * @access  Protected (Requires Bearer token via authGuard)
 * Required by Task 3 & Task 5:
 * Must use .populate('attendeeId', 'name email') and .populate('eventId', 'title date venue')
 */
const getMyTickets = async (req, res, next) => {
  try {
    const attendeeId = req.user.id;

    const tickets = await Ticket.find({ attendeeId })
      .populate('attendeeId', 'name email')
      .populate('eventId', 'title date venue ticketsAvailable category')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update ticket status
 * @route   PATCH /api/v1/tickets/:id/status
 * @access  Protected (Requires Bearer token via authGuard)
 * Required by Task 3: status in ['booked', 'cancelled', 'used']
 */
const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['booked', 'cancelled', 'used'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: `Ticket not found with ID ${id}`,
      });
    }

    // If changing from booked to cancelled, replenish the event's ticketsAvailable
    if (ticket.status === 'booked' && status === 'cancelled') {
      await Event.findByIdAndUpdate(ticket.eventId, {
        $inc: { ticketsAvailable: ticket.quantity },
      });
    }

    ticket.status = status;
    await ticket.save();

    await ticket.populate([
      { path: 'attendeeId', select: 'name email' },
      { path: 'eventId', select: 'title date venue' },
    ]);

    res.status(200).json({
      success: true,
      message: `Ticket status successfully updated to '${status}'`,
      data: ticket,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { bookTicket, getMyTickets, updateTicketStatus };
