import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import MyTicketsPage from './pages/MyTicketsPage';

// Task 2 Requirement: Lazy-loaded route for Organizer Panel using React.lazy + Suspense
const OrganizerPanel = lazy(() => import('./pages/OrganizerPanel'));

// Suspense loading fallback component
const LazyLoadingFallback = () => (
  <div className="loading-container" style={{ minHeight: '50vh' }}>
    <div className="spinner" />
    <p style={{ marginTop: 12 }}>Loading Organizer Panel...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Route 1: / -> LoginPage (Public) */}
              <Route path="/" element={<LoginPage />} />

              {/* Route 2: /events -> EventsPage (Protected) */}
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <EventsPage />
                  </ProtectedRoute>
                }
              />

              {/* Route 3: /my-tickets -> MyTicketsPage (Protected) */}
              <Route
                path="/my-tickets"
                element={
                  <ProtectedRoute>
                    <MyTicketsPage />
                  </ProtectedRoute>
                }
              />

              {/* Route 4: /organizer -> OrganizerPanel (Lazy-loaded, Protected, role: 'organizer') */}
              <Route
                path="/organizer"
                element={
                  <ProtectedRoute requiredRole="organizer">
                    <Suspense fallback={<LazyLoadingFallback />}>
                      <OrganizerPanel />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
