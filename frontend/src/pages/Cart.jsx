import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getAlbum } from '../api/albums';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, loading, updateItem, removeItem, clearCartItems } = useCart();
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  if (loading) return <div className="p-8 text-center text-taupe font-sans">Loading cart...</div>;

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center py-20">
        <div className="w-20 h-20 bg-cream-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-taupe-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
        </div>
        <h1 className="font-serif text-2xl font-bold text-brown mb-3">Your Cart is Empty</h1>
        <p className="text-taupe mb-8 font-sans">Start by creating an album from our collections.</p>
        <Link to="/templates" className="bg-terra text-white px-8 py-3 rounded-full hover:bg-terra-dark transition font-sans font-semibold">
          Explore Collections
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-2xl font-bold text-brown">Shopping Cart</h1>
        <button onClick={handleClear} className="text-sm text-terra-dark hover:text-terra font-sans font-medium">
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-warm-white p-5 rounded-2xl border border-warm-border">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h3 className="font-serif font-bold text-brown">{item.album?.title || 'Album'}</h3>
                <p className="text-sm text-taupe font-sans mt-1">
                  {item.album?.template_size?.template?.name} &middot; {item.album?.template_size?.size?.label || ''} &middot; {item.album?.photos?.length || 0} photos
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-warm-border flex items-center justify-center hover:bg-cream-dark text-brown font-sans transition"
                >
                  -
                </button>
                <span className="w-8 text-center font-sans font-medium text-brown">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-warm-border flex items-center justify-center hover:bg-cream-dark text-brown font-sans transition"
                >
                  +
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => handlePreview(item.album)}
                  disabled={previewLoading}
                  className="text-terra hover:text-terra-dark text-sm font-medium disabled:opacity-50 font-sans"
                >
                  Preview
                </button>
                <button onClick={() => handleRemove(item.id)} className="text-terra-dark/60 hover:text-terra-dark text-sm font-sans">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-warm-white p-6 rounded-2xl border border-warm-border">
        <div className="flex justify-between items-center mb-4">
          <span className="font-serif text-lg font-bold text-brown">Total</span>
          <span className="text-xl font-bold text-terra font-sans">&#8377;{total.toFixed(2)}</span>
        </div>
        <Link
          to="/checkout"
          className="block w-full text-center bg-terra text-white py-3.5 rounded-full hover:bg-terra-dark transition font-sans font-semibold tracking-wide"
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
    <div className="fixed inset-0 bg-brown/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-warm-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 border border-warm-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="font-serif text-xl font-bold text-brown">{album.title}</h2>
            <p className="text-sm text-taupe font-sans">
              {album.template_size?.template?.name} &middot; {photos.length} photos
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-dark hover:bg-warm-gray flex items-center justify-center text-brown transition"
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
                className="w-full aspect-square object-cover rounded-xl"
              />
            ))}
          </div>
        ) : (
          <p className="text-taupe-light text-center py-8 font-sans">No photos in this album</p>
        )}
      </div>
    </div>
  );
}
