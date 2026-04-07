import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// User Pages
import EventList from './pages/user/EventList';
import SeatSelection from './pages/user/SeatSelection';
import BookingHistory from './pages/user/BookingHistory';
import WalletDashboard from './pages/user/WalletDashboard'; // FIXED TYPO: Was WalletDahboard
import BookingConfirm from './pages/user/BookingConfirm';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminBookings from './pages/admin/AdminBookings';
import TransactionDashboard from './pages/admin/TransactionDashboard';

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole');

  // 1. If not logged in, redirect to the SPECIFIC login page
  if (!token) {
    if (allowedRole === 'admin') return <Navigate to="/admin/login" replace />;
    return <Navigate to="/user/login" replace />;
  }

  // 2. If role doesn't match
  if (allowedRole && role !== allowedRole) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'user') return <Navigate to="/" replace />;
    return <Navigate to="/user/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EventList />} />
          <Route path="events/:eventId/seats" element={<SeatSelection />} />
          <Route path="bookings" element={<BookingHistory />} />
          <Route path="wallet" element={<WalletDashboard />} />
          <Route path="booking/confirm" element={<BookingConfirm />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="transactions" element={<TransactionDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/user/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;