// src/lib/seat.api.js
import api from './api';

export const getEventSeats = (eventId) => {
  return api.get(`/events/${eventId}/seats`);
};

export const reserveSeats = (eventId, seatIds) => {
  return api.post(`/events/${eventId}/reserve`, { seatIds });
};

export const confirmBooking = (eventId, seatIds) => {
  return api.post('/user/bookings/confirm', { 
    eventId, 
    seatIds 
  });
};

export const releaseSeats = (eventId, seatIds) => {
  return api.post(`/events/${eventId}/release`, { seatIds });
};

// 5. Fetch all bookings for the current user
export const getUserBookings = () => {
  // Adjust the endpoint if your backend uses a different path (e.g., '/bookings/my')
  return api.get('/user/bookings');
};

export default {
  getEventSeats,
  reserveSeats,
  confirmBooking,
  releaseSeats,
  getUserBookings
};