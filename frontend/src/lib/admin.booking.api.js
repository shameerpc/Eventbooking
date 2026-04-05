// src/lib/admin.booking.api.js
import api from './api';

// 1. List all bookings
export const getAdminBookings = () => {
  return api.get('/admin/bookings');
};

// 2. Cancel a booking
// URL: /admin/bookings/cancel/:id
export const cancelBooking = (bookingId) => {
  return api.post(`/admin/bookings/cancel/${bookingId}`);
};

// 3. Refund a booking
// URL: /admin/bookings/refund/:id
export const refundBooking = (bookingId) => {
  return api.post(`/admin/bookings/refund/${bookingId}`);
};

export default {
  getAdminBookings,
  cancelBooking,
  refundBooking,
};