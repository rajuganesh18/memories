import api from './client';

export const createOrder = (addressId) =>
  api.post('/orders/', { address_id: addressId });
export const getOrders = () => api.get('/orders/');
export const getOrder = (orderId) => api.get(`/orders/${orderId}`);
