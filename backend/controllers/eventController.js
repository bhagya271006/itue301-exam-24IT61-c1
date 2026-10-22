const Event = require('../models/Event');

/**
 * @desc    Get all events
 * @route   GET /api/v1/events
 * @access  Public (Required by Task 3)
 */
const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/v1/events/:id
 * @access  Public
 */
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: `Event not found with id ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create new event (Organizer panel)
 * @route   POST /api/v1/events
 * @access  Protected (Organizer / Admin)
 */
const createEvent = async (req, res, next) => {
  try {
    const { title, category, date, venue, ticketsAvailable } = req.body;

    const event = await Event.create({
      title,
      category,
      date,
      venue,
      ticketsAvailable: Number(ticketsAvailable),
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getEvents, getEventById, createEvent };
