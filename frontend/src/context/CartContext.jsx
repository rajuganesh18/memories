import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeCartItem, clearCart as apiClearCart } from '../api/cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const { data } = await getCart();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (albumId, quantity = 1) => {
    const { data } = await apiAddToCart(albumId, quantity);
    setCart(data);
    return data;
  };

  const updateItem = async (itemId, quantity) => {
    const { data } = await updateCartItem(itemId, quantity);
    setCart(data);
    return data;
  };

  const removeItem = async (itemId) => {
    await removeCartItem(itemId);
    await fetchCart();
  };

  const clearCartItems = async () => {
    await apiClearCart();
    setCart(null);
  };

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, addToCart, updateItem, removeItem, clearCartItems, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
