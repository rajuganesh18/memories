import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, loading, updateItem, removeItem, clearCartItems } = useCart();

  if (loading) return <div className="p-8 text-center">Loading cart...</div>;

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">Start by creating an album from our templates.</p>
        <Link to="/templates" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
          Browse Templates
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, item) => {
    const price = item.album?.template_size?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateItem(itemId, quantity);
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId);
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleClear = async () => {
    try {
      await clearCartItems();
      toast.success('Cart cleared');
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <button onClick={handleClear} className="text-sm text-red-500 hover:text-red-700">
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex-1">
              <h3 className="font-semibold">{item.album?.title || 'Album'}</h3>
              <p className="text-sm text-gray-500">
                {item.album?.template_size?.template?.name} &middot; {item.album?.template_size?.size?.label || ''} &middot; {item.album?.photos?.length || 0} photos
              </p>
              <p className="text-sm text-gray-500">Status: {item.album?.status}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-700 text-sm">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-xl font-bold text-indigo-600">&#8377;{total.toFixed(2)}</span>
        </div>
        <Link
          to="/checkout"
          className="block w-full text-center bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
