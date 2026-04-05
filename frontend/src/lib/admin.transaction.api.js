// src/lib/admin.transaction.api.js
import api from './api';

// 1. Get all transactions
export const getTransactions = () => {
  return api.get('/admin/transactions');
};

export default {
  getTransactions,
};