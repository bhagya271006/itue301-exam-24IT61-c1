import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [token, setToken] = useState(() => localStorage.getItem('eventhub_token') || null);
  const [attendee, setAttendee] = useState(() => {
    const saved = localStorage.getItem('eventhub_attendee');
    return saved ? JSON.parse(saved) : null;
  });
  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('eventhub_attendee');
    return saved ? JSON.parse(saved).role : null;
  });

  // Login handler
  const login = (newToken, attendeeData) => {
    setToken(newToken);
    setAttendee(attendeeData);
    setRole(attendeeData.role);

    localStorage.setItem('eventhub_token', newToken);
    localStorage.setItem('eventhub_attendee', JSON.stringify(attendeeData));
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setAttendee(null);
    setRole(null);

    localStorage.removeItem('eventhub_token');
    localStorage.removeItem('eventhub_attendee');
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        attendee,
        token,
        role,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
