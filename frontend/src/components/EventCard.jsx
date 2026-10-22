import React from 'react';
import { Calendar, MapPin, Tag, Users } from 'lucide-react';

/**
 * EventCard Component
 * Required by Task 1 of ITUE301 Set F
 * Accepts props: title, category, date, venue, ticketsAvailable
 * Displays all 5 values.
 * Renders "Sold Out" badge if ticketsAvailable === 0, else "Book" button.
 */
const EventCard = ({ title, category, date, venue, ticketsAvailable, onBook }) => {
  // Hint requirement: simple conditional check for sold-out status at the top
  const isSoldOut = ticketsAvailable === 0;

  // Format date nicely
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Date TBD';

  return (
    <div className="event-card">
      <div>
        <div className="event-card-header">
          <span className="event-category-badge">
            <Tag size={12} style={{ display: 'inline', marginRight: 4 }} />
            {category || 'General'}
          </span>
          {isSoldOut ? (
            <span className="sold-out-badge">Sold Out</span>
          ) : (
            <span style={{ color: '#34d399', fontSize: '0.78rem', fontWeight: 600 }}>
              Available
            </span>
          )}
        </div>

        <h3 className="event-title">{title}</h3>

        <div className="event-meta">
          <div className="meta-item">
            <Calendar size={16} className="meta-icon" />
            <span>{formattedDate}</span>
          </div>
          <div className="meta-item">
            <MapPin size={16} className="meta-icon" />
            <span>{venue}</span>
          </div>
          <div className="meta-item">
            <Users size={16} className="meta-icon" />
            <span>Seats: {ticketsAvailable} tickets available</span>
          </div>
        </div>
      </div>

      <div className="event-card-footer">
        <div className="tickets-info">
          <span className="tickets-count">{ticketsAvailable}</span>
          <span className="tickets-label">Remaining</span>
        </div>

        {/* Conditional rendering: Sold Out Badge vs Book Button */}
        {isSoldOut ? (
          <span className="sold-out-badge" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Sold Out
          </span>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onBook}
          >
            Book Ticket
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
