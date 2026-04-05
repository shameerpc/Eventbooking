// src/lib/event.api.js
import api from './api';

export const getEvents = async () => {
  const response = await api.get('/user/events');
  return response.data; // adjust if your API wraps data, e.g., response.data.events
};