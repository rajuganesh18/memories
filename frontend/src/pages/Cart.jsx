import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getAlbum } from '../api/albums';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, loading, updateItem, removeItem, clearCartItems } = useCart();
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

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

  const handlePreview = async (album) => {
    setPreviewLoading(true);
    try {
      const res = await getAlbum(album.id);
      setPreview(res.data);
    } catch {
      toast.error('Failed to load preview');
    } finally {
      setPreviewLoading(false);
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
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold">{item.album?.title || 'Album'}</h3>
                <p className="text-sm text-gray-500">
                  {item.album?.template_size?.template?.name} &middot; {item.album?.template_size?.size?.label || ''} &middot; {item.album?.photos?.length || 0} photos
                </p>
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
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handlePreview(item.album)}
                  disabled={previewLoading}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:opacity-50"
                >
                  Preview
                </button>
                <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              </div>
            </div>
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

      {/* Album preview modal */}
      {preview && (
        <AlbumPreviewModal album={preview} onClose={() => setPreview(null)} />
      )}
    </div>
  );
}

function AlbumPreviewModal({ album, onClose }) {
  const photos = album.photos || [];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{album.title}</h2>
            <p className="text-sm text-gray-500">
              {album.template_size?.template?.name} &middot; {photos.length} photos
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
          >
            X
          </button>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {photos.map((p) => (
              <img
                key={p.id}
                src={p.photo_url}
                alt="Album photo"
                className="w-full aspect-square object-cover rounded-lg"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No photos in this album</p>
        )}
      </div>
    </div>
  );
}
