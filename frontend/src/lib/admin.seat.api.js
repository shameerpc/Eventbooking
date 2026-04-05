// src/lib/admin.seat.api.js
import api from './api';

// 1. Generate/Create seats for an event
// Payload: { "eventId": "...", "seats": 40 }
export const generateSeats = (eventId, seatCount) => {
  return api.post('/admin/seats', { 
    eventId, 
    seats: seatCount 
  });
};

// 2. Fetch seats for an event (To show the overview)
// Reusing the standard endpoint from user side
export const getEventSeats = (eventId) => {
  return api.get(`/events/${eventId}/seats`);
};

// 3. Fetch all events (To populate the dropdown)
export const getEvents = () => {
  return api.get('/admin/events');
};

export default {
  generateSeats,
  getEventSeats,
  getEvents
};