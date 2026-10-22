import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Ticket, Calendar, UserCheck, Shield, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar Component
 * Required by Task 2 of ITUE301 Set F
 * Uses React Router NavLink for seamless client-side routing without full page reload.
 */
const Navbar = () => {
  const { attendee, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <NavLink to="/events" className="nav-brand">
          <Ticket size={24} style={{ color: '#818cf8' }} />
          EventHub
        </NavLink>
        <span className="nav-brand-badge">SET F · ITUE301</span>
      </div>

      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <NavLink
              to="/events"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Calendar size={16} />
              Events
            </NavLink>

            <NavLink
              to="/my-tickets"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Ticket size={16} />
              My Tickets
            </NavLink>

            <NavLink
              to="/organizer"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Shield size={16} />
              Organizer Panel
            </NavLink>
          </>
        ) : (
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <LogIn size={16} />
            Login
          </NavLink>
        )}
      </div>

      <div className="nav-user">
        {isAuthenticated ? (
          <>
            <div className="user-badge">
              <UserCheck size={14} style={{ color: '#818cf8' }} />
              <span>{attendee?.name || 'User'}</span>
              <span className={`role-pill role-${role || 'attendee'}`}>
                {role || 'attendee'}
              </span>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={14} />
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/" className="btn btn-primary btn-sm">
            Sign In
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
