import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Workers from './pages/admin/Workers';
import Bookings from './pages/admin/Bookings';
import Services from './pages/admin/Services';
import Payments from './pages/admin/Payments';
import Reviews from './pages/admin/Reviews';
import Support from './pages/admin/Support';
import Reports from './pages/admin/Reports';
import Analytics from './pages/admin/Analytics';
import Notifications from './pages/admin/Notifications';
import AuditLogs from './pages/admin/AuditLogs';
import Trash from './pages/admin/Trash';
import Settings from './pages/admin/Settings';
import Profile from './pages/admin/Profile';
import WorkerVerification from './pages/admin/WorkerVerification';
import WorkerAvailability from './pages/admin/WorkerAvailability';
import Refunds from './pages/admin/Refunds';
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
          <Route path="workers" element={<Workers />} />
          <Route path="worker-verification" element={<WorkerVerification />} />
          <Route path="worker-availability" element={<WorkerAvailability />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="services" element={<Services />} />
          <Route path="payments" element={<Payments />} />
          <Route path="refunds" element={<Refunds />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="support" element={<Support />} />
          <Route path="reports" element={<Reports />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="auditlogs" element={<AuditLogs />} />
          <Route path="trash" element={<Trash />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
