import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Login from './pages/auth/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Redirect Root to Dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          
          {/* Placeholder routes for future modules */}
          <Route path="workers" element={<div className="p-6">Workers Module (Coming Soon)</div>} />
          <Route path="bookings" element={<div className="p-6">Bookings Module (Coming Soon)</div>} />
          <Route path="services" element={<div className="p-6">Services Module (Coming Soon)</div>} />
          <Route path="payments" element={<div className="p-6">Payments Module (Coming Soon)</div>} />
          <Route path="reviews" element={<div className="p-6">Reviews Module (Coming Soon)</div>} />
          <Route path="reports" element={<div className="p-6">Reports Module (Coming Soon)</div>} />
          <Route path="analytics" element={<div className="p-6">Analytics Module (Coming Soon)</div>} />
          <Route path="notifications" element={<div className="p-6">Notifications Module (Coming Soon)</div>} />
          <Route path="auditlogs" element={<div className="p-6">Audit Logs Module (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-6">Settings Module (Coming Soon)</div>} />
          <Route path="profile" element={<div className="p-6">Profile Module (Coming Soon)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
