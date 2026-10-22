import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Search, AlertCircle, CheckCircle, X, Sparkles } from 'lucide-react';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';

/**
 * EventsPage Component
 * Route: '/events' (Protected)
 * Covers:
 * - Task 1: Renders EventCard with props
 * - Task 2: Booking form with useState (selectedEvent, ticketQuantity)
 * - Task 4: API consumption with useEffect, states (events, loading, error), client-side search filter
 */
const EventsPage = () => {
  // Required by Task 4: Maintain three states: events, loading, error
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Client-side search state
  const [searchQuery, setSearchQuery] = useState('');

  // Required by Task 2: Booking form state with useState (selected event, quantity)
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  const { token } = useAuth();
  const location = useLocation();

  // Role error redirected from ProtectedRoute (e.g. attendee trying to access /organizer)
  const roleWarning = location.state?.roleError;

  // Task 4: useEffect hook to fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/v1/events');
      if (response.data.success) {
        setEvents(response.data.data);
      } else {
        setError('Failed to load events from the server.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to connect to the Event API.');
    } finally {
      setLoading(false);
    }
  };

  // Task 4 Hint: derive filtered list with .filter() on render without new API call
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open booking modal
  const handleOpenBooking = (event) => {
    setSelectedEvent(event);
    setTicketQuantity(1);
    setBookingError('');
    setBookingSuccess('');
  };

  // Close booking modal
  const handleCloseBooking = () => {
    setSelectedEvent(null);
    setTicketQuantity(1);
    setBookingError('');
  };

  // Handle booking submission (Task 3 & 5 endpoint)
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setBookingLoading(true);
    setBookingError('');

    try {
      const response = await axios.post(
        '/api/v1/tickets',
        {
          eventId: selectedEvent._id,
          quantity: Number(ticketQuantity),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setBookingSuccess(
          `Success! Booked ${ticketQuantity} ticket(s) for "${selectedEvent.title}". Check 'My Tickets'.`
        );

        // Update the event's ticketsAvailable in local state immediately
        setEvents((prevEvents) =>
          prevEvents.map((ev) =>
            ev._id === selectedEvent._id
              ? { ...ev, ticketsAvailable: response.data.remainingTickets }
              : ev
          )
        );

        handleCloseBooking();
      }
    } catch (err) {
      setBookingError(
        err.response?.data?.error || 'Booking failed. Please try again.'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div>
      {/* Role Warning Banner (if redirected by ProtectedRoute role guard) */}
      {roleWarning && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{roleWarning}</span>
        </div>
      )}

      {/* Global Booking Success Banner */}
      {bookingSuccess && (
        <div className="alert alert-success">
          <CheckCircle size={20} />
          <span>{bookingSuccess}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Explore Events</h1>
          <p className="page-subtitle">
            Browse upcoming conferences, workshops, and concerts at CHARUSAT.
          </p>
        </div>

        {/* Task 4: Client-side search box that filters already-fetched events by title */}
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search events by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Task 4 Condition 1: Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading available events...</p>
        </div>
      )}

      {/* Task 4 Condition 2: Error State */}
      {error && !loading && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Task 4 Condition 3: Render Events via EventCard */}
      {!loading && !error && (
        <>
          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>No matching events found</p>
              <p style={{ fontSize: '0.9rem' }}>
                Try searching for something else or clear your search query.
              </p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  title={event.title}
                  category={event.category}
                  date={event.date}
                  venue={event.venue}
                  ticketsAvailable={event.ticketsAvailable}
                  onBook={() => handleOpenBooking(event)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Task 2: Interactive Booking Modal Form */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={handleCloseBooking}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span className="event-category-badge">{selectedEvent.category}</span>
                <button
                  type="button"
                  onClick={handleCloseBooking}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <h2 className="modal-title" style={{ marginTop: 12 }}>
                Book Tickets
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {selectedEvent.title}
              </p>
            </div>

            {bookingError && (
              <div className="alert alert-error" style={{ marginBottom: 16 }}>
                <AlertCircle size={18} />
                <span>{bookingError}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit}>
              {/* Meaningful State 1: Selected Event (Read-only representation) */}
              <div className="form-group">
                <label className="form-label">Selected Event</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedEvent.title}
                  disabled
                  style={{ opacity: 0.8, cursor: 'not-allowed' }}
                />
              </div>

              {/* Meaningful State 2: Quantity managed via useState */}
              <div className="form-group">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <label className="form-label" htmlFor="ticketQuantity">
                    Ticket Quantity
                  </label>
                  <span style={{ fontSize: '0.8rem', color: '#818cf8' }}>
                    Available: {selectedEvent.ticketsAvailable}
                  </span>
                </div>
                <input
                  id="ticketQuantity"
                  type="number"
                  min="1"
                  max={selectedEvent.ticketsAvailable}
                  className="form-input"
                  value={ticketQuantity}
                  onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseBooking}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={bookingLoading || selectedEvent.ticketsAvailable < 1}
                >
                  {bookingLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                      Confirming...
                    </span>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
