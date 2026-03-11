import api from './client';

export const createPayment = (orderId) =>
  api.post('/payments/create', { order_id: orderId });
export const verifyPayment = (data) =>
  api.post('/payments/verify', data);
