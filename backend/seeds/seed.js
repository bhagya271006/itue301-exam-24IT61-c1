const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Attendee = require('../models/Attendee');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

const seedData = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub_db';

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('[Seed] Connected to database');
  } catch (err) {
    console.log('[Seed] Local DB connection failed, using MongoMemoryServer...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    console.log('[Seed] Connected to memory DB');
  }

  try {
    // Clear existing collections
    await Attendee.deleteMany({});
    await Event.deleteMany({});
    await Ticket.deleteMany({});
    console.log('[Seed] Cleared existing data');

    // Create Attendees and Organizer
    const attendee1 = await Attendee.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 9876543210',
      role: 'attendee',
      password: 'password123',
    });

    const attendee2 = await Attendee.create({
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 9822334455',
      role: 'attendee',
      password: 'password123',
    });

    const organizer = await Attendee.create({
      name: 'Dr. Devang Joshi',
      email: 'organizer@eventhub.com',
      phone: '+91 9123456789',
      role: 'organizer',
      password: 'password123',
    });

    const admin = await Attendee.create({
      name: 'Campus Administrator',
      email: 'admin@eventhub.com',
      phone: '+91 9998887776',
      role: 'admin',
      password: 'password123',
    });

    console.log('[Seed] Created users (Attendees, Organizer, Admin)');

    // Create Events (including one with ticketsAvailable: 0 for testing Sold Out)
    const events = await Event.create([
      {
        title: 'CHARUSAT Tech Conclave 2026',
        category: 'Technology',
        date: new Date('2026-11-15T10:00:00Z'),
        venue: 'CSPIT Auditorium, Changa',
        ticketsAvailable: 150,
      },
      {
        title: 'National AI & Web3 Hackathon',
        category: 'Hackathon',
        date: new Date('2026-11-28T09:00:00Z'),
        venue: 'Computer Engineering Block C',
        ticketsAvailable: 40,
      },
      {
        title: 'Spandan Cultural Music Festival',
        category: 'Music',
        date: new Date('2026-12-05T18:00:00Z'),
        venue: 'University Central Lawns',
        ticketsAvailable: 200,
      },
      {
        title: 'Full-Stack Cloud DevOps Workshop',
        category: 'Workshop',
        date: new Date('2026-12-12T11:00:00Z'),
        venue: 'DEPSTAR Seminar Hall 2',
        ticketsAvailable: 15,
      },
      {
        title: 'Exclusive Leadership Masterclass',
        category: 'Conference',
        date: new Date('2026-12-20T14:00:00Z'),
        venue: 'Executive Boardroom, CHARUSAT',
        ticketsAvailable: 0, // SOLD OUT TEST CASE (Task 1)
      },
    ]);

    console.log(`[Seed] Created ${events.length} sample events`);

    // Create an initial booked ticket for Rahul
    const initialTicket = await Ticket.create({
      attendeeId: attendee1._id,
      eventId: events[0]._id,
      quantity: 2,
      bookingDate: new Date(),
      status: 'booked',
    });

    // Decrement the event's ticketsAvailable
    await Event.findByIdAndUpdate(events[0]._id, { $inc: { ticketsAvailable: -2 } });

    console.log('[Seed] Created initial ticket booking for demo');
    console.log('\n--- SEED SUMMARY ---');
    console.log('Attendee Login: rahul@example.com / password123');
    console.log('Organizer Login: organizer@eventhub.com / password123');
    console.log('Admin Login: admin@eventhub.com / password123');
    console.log('--------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seedData();
