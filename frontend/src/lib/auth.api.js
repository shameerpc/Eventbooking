import api from './api';

export const login = async (email, password, role = 'user') => {
  // FIX: Try changing '/admin/auth/login' to '/admin/login'
  const endpoint = role === 'admin' ? '/admin/login' : '/user/auth/login';
  
  const response = await api.post(endpoint, { email, password });
  return response.data;
};

export const register = async ({ name, email, password, passwordConfirm }) => {
  const response = await api.post('/user/auth/register', {
    name,
    email,
    password,
    passwordConfirm,
  });
  return response.data;
};