// src/lib/admin.api.js
import api from './api';

// 1. Get all events
export const getAdminEvents = () => {
  return api.get('/admin/events');
};

// 2. Create a new event
export const createEvent = (eventData) => {
  return api.post('/admin/events', eventData);
};

// 3. Update an existing event (PUT)
export const updateEvent = (eventId, eventData) => {
  return api.put(`/admin/events/${eventId}`, eventData);
};

// 4. Delete an event
export const deleteEvent = (eventId) => {
  return api.delete(`/admin/events/${eventId}`);
};

export default {
  getAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};