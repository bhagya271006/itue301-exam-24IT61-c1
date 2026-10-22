const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to Database
const connectDB = require('./config/db');
connectDB();

// Import Middlewares
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

// Body Parser Middleware
app.use(express.json());

// Enable CORS for frontend
app.use(cors());

// Global Request Logger Middleware (Task 3 Requirement)
app.use(requestLogger);

// API Routes (Mounted under /api/v1/)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/tickets', ticketRoutes);

// Base route for health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ITUE301 Set F - EventHub API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth/login',
      events: '/api/v1/events',
      tickets: '/api/v1/tickets',
      myTickets: '/api/v1/tickets/my',
    },
  });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler Middleware (Task 3 Requirement: must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[EventHub Server] Running on http://localhost:${PORT}`);
  console.log(`[EventHub Server] REST Endpoints mounted at /api/v1/`);
});
