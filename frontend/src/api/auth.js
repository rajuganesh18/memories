import api from './client';

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const refreshToken = (refresh_token) =>
  api.post('/auth/refresh', { refresh_token });
export const getMe = () => api.get('/auth/me');
export const updateMe = (data) => api.put('/auth/me', data);
