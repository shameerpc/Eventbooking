// src/lib/wallet.api.js
import api from './api'; 

export const addFunds = async (amount) => {
  // ADD '/user' here
  const response = await api.post('/user/wallet/add', { amount });
  return response.data;
};

export const getTransactions = async () => {
  // ADD '/user' here
  const response = await api.get('/user/wallet/transactions');
  return response.data; 
};

export const getWallet = async () => {
  // ADD '/user' here
  const response = await api.get('/user/wallet');
  return response.data;
};