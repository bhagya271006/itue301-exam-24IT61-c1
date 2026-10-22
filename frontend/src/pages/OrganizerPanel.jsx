import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, PlusCircle, CheckCircle, AlertCircle, Calendar, MapPin, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * OrganizerPanel Component
 * Route: '/organizer' (Lazy-loaded via React.lazy & Suspense)
 * Required by Task 2 of ITUE301 Set F
 * Restricted to role: 'organizer' | 'admin'
 */
const OrganizerPanel = () => {
  const { token, attendee } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [ticketsAvailable, setTicketsAvailable] = useState(100);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/v1/events');
      if (res.data.success) {
        setRecentEvents(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        '/api/v1/events',
        {
          title,
          category,
          date,
          venue,
          ticketsAvailable: Number(ticketsAvailable),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(`Event "${title}" published successfully!`);
        setTitle('');
        setDate('');
        setVenue('');
        setTicketsAvailable(100);
        fetchEvents();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Shield size={28} style={{ color: '#fbbf24' }} />
            <h1 className="page-title">Organizer Control Panel</h1>
          </div>
          <p className="page-subtitle">
            Welcome, {attendee?.name}! Manage your hosted events and track ticket inventory.
          </p>
        </div>
      </div>

      {success && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
        {/* Create Event Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--bg-card-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <PlusCircle size={22} color="#818cf8" />
            <h2 style={{ fontSize: '1.35rem' }}>Publish New Event</h2>
          </div>

          <form onSubmit={handleCreateEvent}>
            <div className="form-group">
              <label className="form-label" htmlFor="eventTitle">
                Event Title *
              </label>
              <input
                id="eventTitle"
                type="text"
                className="form-input"
                placeholder="e.g. National Hackathon 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="eventCategory">
                Category
              </label>
              <select
                id="eventCategory"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Technology">Technology</option>
                <option value="Workshop">Workshop</option>
                <option value="Music">Music</option>
                <option value="Cultural">Cultural</option>
                <option value="Conference">Conference</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="eventDate">
                Event Date & Time *
              </label>
              <input
                id="eventDate"
                type="datetime-local"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="eventVenue">
                Venue Location *
              </label>
              <input
                id="eventVenue"
                type="text"
                className="form-input"
                placeholder="e.g. CSPIT Auditorium, Changa"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="eventTickets">
                Total Available Tickets (min 0) *
              </label>
              <input
                id="eventTickets"
                type="number"
                min="0"
                className="form-input"
                value={ticketsAvailable}
                onChange={(e) => setTicketsAvailable(Math.max(0, parseInt(e.target.value) || 0))}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 10 }}
              disabled={loading}
            >
              {loading ? 'Publishing Event...' : 'Publish Event'}
            </button>
          </form>
        </div>

        {/* Live Inventory Overview */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--bg-card-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 30,
          }}
        >
          <h2 style={{ fontSize: '1.35rem', marginBottom: 18 }}>Current Platform Events</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recentEvents.map((ev) => (
              <div
                key={ev._id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--bg-card-border)',
                  padding: 14,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.98rem', marginBottom: 4 }}>{ev.title}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
                    <span>{ev.category}</span>
                    <span>•</span>
                    <span>{ev.venue}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: ev.ticketsAvailable === 0 ? '#f87171' : '#34d399',
                    }}
                  >
                    {ev.ticketsAvailable === 0 ? 'SOLD OUT' : `${ev.ticketsAvailable} left`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerPanel;
