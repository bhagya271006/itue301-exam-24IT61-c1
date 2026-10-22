import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket, Calendar, MapPin, AlertCircle, CheckCircle, Ban, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * MyTicketsPage Component
 * Route: '/my-tickets' (Protected)
 * Displays attendee's tickets populated with Attendee and Event details.
 * Allows status cancellation via PATCH /api/v1/tickets/:id/status.
 */
const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const { token, attendee } = useAuth();

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/v1/tickets/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setTickets(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to retrieve tickets.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await axios.patch(
        `/api/v1/tickets/${ticketId}/status`,
        { status: 'cancelled' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setActionMessage('Ticket status successfully updated to cancelled.');
        // Update local ticket list
        setTickets((prev) =>
          prev.map((t) => (t._id === ticketId ? { ...t, status: 'cancelled' } : t))
        );
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel ticket.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Booked Tickets</h1>
          <p className="page-subtitle">
            Manage your event reservations for {attendee?.name} ({attendee?.email})
          </p>
        </div>
      </div>

      {actionMessage && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{actionMessage}</span>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <p>Fetching your tickets...</p>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          {tickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Ticket size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
              <p style={{ fontSize: '1.2rem', marginBottom: 6 }}>No tickets booked yet</p>
              <p style={{ fontSize: '0.9rem' }}>
                Visit the Events page to browse and book upcoming events.
              </p>
            </div>
          ) : (
            <div className="tickets-list">
              {tickets.map((ticket) => {
                const event = ticket.eventId || {};
                const eventDate = event.date
                  ? new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Date TBD';

                const bookedAt = ticket.bookingDate
                  ? new Date(ticket.bookingDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recently';

                return (
                  <div key={ticket._id} className="ticket-item">
                    <div style={{ flex: '1 1 300px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span className={`ticket-status-pill status-${ticket.status}`}>
                          {ticket.status}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                          Ticket ID: {ticket._id}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', marginBottom: 10 }}>
                        {event.title || 'Event Title Unavailable'}
                      </h3>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 16,
                          fontSize: '0.85rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Calendar size={15} color="#818cf8" />
                          <span>{eventDate}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MapPin size={15} color="#818cf8" />
                          <span>{event.venue || 'Venue TBD'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={15} color="#818cf8" />
                          <span>Booked on: {bookedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 24,
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {ticket.quantity}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                          Seats Reserved
                        </div>
                      </div>

                      {ticket.status === 'booked' && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelTicket(ticket._id)}
                        >
                          <Ban size={14} />
                          Cancel Ticket
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyTicketsPage;
