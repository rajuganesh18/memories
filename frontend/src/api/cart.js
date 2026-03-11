import api from './client';

export const getCart = () => api.get('/cart/');
export const addToCart = (albumId, quantity = 1) =>
  api.post('/cart/items', { album_id: albumId, quantity });
export const updateCartItem = (itemId, quantity) =>
  api.put(`/cart/items/${itemId}`, { quantity });
export const removeCartItem = (itemId) =>
  api.delete(`/cart/items/${itemId}`);
export const clearCart = () => api.delete('/cart/');
