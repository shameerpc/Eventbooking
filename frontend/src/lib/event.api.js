// src/lib/event.api.js
import api from './api';

export const getEvents = async () => {
  const response = await api.get('/user/events');
  // FIX: Your API returns { success: true, events: [...] }
  // We must return response.data.events to get the array
  return response.data.events; 
};