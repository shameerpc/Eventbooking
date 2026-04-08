// src/lib/seat.api.js
import api from './api';

/**
 * Fetches the seat map for a specific event.
 * @param {string} eventId - The ID of the event.
 * @returns {Promise<AxiosResponse>} The response containing seat data.
 */
export const getEventSeats = (eventId) => {
  return api.get(`/events/${eventId}/seats`);
};

/**
 * Reserves selected seats for a specific event (temporary hold).
 * @param {string} eventId - The ID of the event.
 * @param {string[]} seatIds - Array of seat IDs to reserve.
 * @returns {Promise<AxiosResponse>} The response confirming the temporary reservation.
 */
export const reserveSeats = (eventId, seatIds) => {
  return api.post(`/events/${eventId}/reserve`, { seatIds });
};

/**
 * Confirms and finalizes the booking for reserved seats.
 * @param {string} eventId - The ID of the event.
 * @param {string[]} seatIds - Array of seat IDs to book.
 * @returns {Promise<AxiosResponse>} The response confirming the final booking.
 */
export const confirmBooking = (eventId, seatIds) => {
  return api.post('/user/bookings/confirm', { 
    eventId, 
    seatIds 
  });
};

/**
 * Releases (un-reserves) seats that were held.
 * @param {string} eventId - The ID of the event.
 * @param {string[]} seatIds - Array of seat IDs to release.
 * @returns {Promise<AxiosResponse>} The response confirming the release.
 */
export const releaseSeats = (eventId, seatIds) => {
  return api.post(`/events/${eventId}/release`, { seatIds });
};

/**
 * Fetches all bookings for the currently authenticated user.
 * @returns {Promise<AxiosResponse>} The response containing user bookings.
 */
export const getUserBookings = () => {
  return api.get('/user/bookings');
};

// Default export for convenience if you prefer importing the whole object
export default {
  getEventSeats,
  reserveSeats,
  confirmBooking,
  releaseSeats,
  getUserBookings
};