// src/lib/wallet.api.js
import api from './api'; // your existing axios instance

export const addFunds = async (amount) => {
  const response = await api.post('/wallet/add', { amount });
  return response.data;
};

export const getTransactions = async () => {
  const response = await api.get('/wallet/transactions');
  return response.data; // adjust based on actual response shape
};

// Optional: get current wallet balance if you have a separate endpoint
export const getWallet = async () => {
  const response = await api.get('/wallet');
  return response.data;
};