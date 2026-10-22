const jwt = require('jsonwebtoken');
const Attendee = require('../models/Attendee');

/**
 * @desc    Authenticate attendee & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password',
      });
    }

    const attendee = await Attendee.findOne({ email: email.toLowerCase().trim() });

    if (!attendee) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const isMatch = await attendee.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const payload = {
      id: attendee._id,
      name: attendee.name,
      email: attendee.email,
      role: attendee.role,
    };

    const secret = process.env.JWT_SECRET || 'eventhub_secret_key_itue301_2026';
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      attendee: {
        _id: attendee._id,
        name: attendee.name,
        email: attendee.email,
        phone: attendee.phone,
        role: attendee.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Register new attendee (Bonus helper)
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existing = await Attendee.findOne({ email: email ? email.toLowerCase().trim() : '' });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered',
      });
    }

    const attendee = await Attendee.create({
      name,
      email: email ? email.toLowerCase().trim() : '',
      phone,
      password,
      role: role || 'attendee',
    });

    const secret = process.env.JWT_SECRET || 'eventhub_secret_key_itue301_2026';
    const token = jwt.sign(
      { id: attendee._id, name: attendee.name, email: attendee.email, role: attendee.role },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Attendee registered successfully',
      token,
      attendee: {
        _id: attendee._id,
        name: attendee.name,
        email: attendee.email,
        phone: attendee.phone,
        role: attendee.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, register };
