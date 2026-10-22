const Attendee = require('../models/Attendee');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

const autoSeedIfEmpty = async () => {
  try {
    const attendeeCount = await Attendee.countDocuments();
    if (attendeeCount > 0) {
      console.log(`[Seed Helper] Database already contains ${attendeeCount} attendees. Skipping auto-seed.`);
      return;
    }

    console.log('[Seed Helper] Database is empty. Seeding demo attendees, events, and ticket...');

    const attendee1 = await Attendee.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 9876543210',
      role: 'attendee',
      password: 'password123',
    });

    await Attendee.create({
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 9822334455',
      role: 'attendee',
      password: 'password123',
    });

    await Attendee.create({
      name: 'Dr. Devang Joshi',
      email: 'organizer@eventhub.com',
      phone: '+91 9123456789',
      role: 'organizer',
      password: 'password123',
    });

    await Attendee.create({
      name: 'Campus Administrator',
      email: 'admin@eventhub.com',
      phone: '+91 9998887776',
      role: 'admin',
      password: 'password123',
    });

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

    // Initial booking for demo
    await Ticket.create({
      attendeeId: attendee1._id,
      eventId: events[0]._id,
      quantity: 2,
      bookingDate: new Date(),
      status: 'booked',
    });

    await Event.findByIdAndUpdate(events[0]._id, { $inc: { ticketsAvailable: -2 } });

    console.log('[Seed Helper] Initial data successfully seeded!');
  } catch (err) {
    console.error('[Seed Helper Error]', err.message);
  }
};

module.exports = autoSeedIfEmpty;
