import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getAddresses, createAddress } from '../api/addresses';
import { createOrder } from '../api/orders';
import { createPayment, verifyPayment } from '../api/payments';
import toast from 'react-hot-toast';

const emptyAddress = {
  full_name: '', phone: '', address_line1: '', address_line2: '',
  city: '', state: '', pincode: '', is_default: false,
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyAddress);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    getAddresses().then(({ data }) => {
      setAddresses(data);
      const def = data.find((a) => a.is_default);
      if (def) setSelectedAddress(def.id);
      else if (data.length > 0) setSelectedAddress(data[0].id);
      else setShowForm(true);
    });
  }, []);

  const items = cart?.items || [];
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  const total = items.reduce((sum, item) => {
    const price = item.album?.template_size?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createAddress(form);
      setAddresses((prev) => [...prev, data]);
      setSelectedAddress(data.id);
      setShowForm(false);
      setForm(emptyAddress);
      toast.success('Address added');
    } catch {
      toast.error('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    setProcessing(true);
    try {
      const { data: order } = await createOrder(selectedAddress);
      const { data: payment } = await createPayment(order.id);

      // In dev mode, mock payment verification directly
      if (payment.razorpay_order_id.startsWith('mock_')) {
        await verifyPayment({
          order_id: order.id,
          razorpay_payment_id: 'mock_pay_' + Date.now(),
          razorpay_order_id: payment.razorpay_order_id,
          razorpay_signature: 'mock_signature',
        });
        await fetchCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${order.id}`);
        return;
      }

      // Production Razorpay checkout
      const options = {
        key: payment.razorpay_key_id,
        amount: payment.amount,
        currency: payment.currency,
        order_id: payment.razorpay_order_id,
        name: 'Memories',
        description: 'Album Order',
        handler: async (response) => {
          try {
            await verifyPayment({
              order_id: order.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            await fetchCart();
            toast.success('Payment successful!');
            navigate(`/order-confirmation/${order.id}`);
          } catch {
            toast.error('Payment verification failed');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Address selection */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Delivery Address</h2>

          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`block p-4 border rounded-lg cursor-pointer ${selectedAddress === addr.id ? 'border-indigo-600 bg-indigo-50' : 'hover:border-gray-400'}`}
            >
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedAddress === addr.id}
                onChange={() => setSelectedAddress(addr.id)}
                className="mr-2"
              />
              <span className="font-medium">{addr.full_name}</span>
              <span className="text-sm text-gray-500 ml-2">{addr.phone}</span>
              <p className="text-sm text-gray-600 mt-1">
                {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
            </label>
          ))}

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              + Add New Address
            </button>
          )}

          {showForm && (
            <form onSubmit={handleAddAddress} className="bg-white p-4 border rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Full Name" required value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="border rounded px-3 py-2 text-sm"
                />
                <input
                  placeholder="Phone" required value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>
              <input
                placeholder="Address Line 1" required value={form.address_line1}
                onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <input
                placeholder="Address Line 2 (optional)" value={form.address_line2}
                onChange={(e) => setForm({ ...form, address_line2: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  placeholder="City" required value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="border rounded px-3 py-2 text-sm"
                />
                <input
                  placeholder="State" required value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="border rounded px-3 py-2 text-sm"
                />
                <input
                  placeholder="Pincode" required value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox" checked={form.is_default}
                  onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                />
                Set as default address
              </label>
              <div className="flex gap-2">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">
                  Save Address
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 text-sm">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order summary */}
        <div className="bg-white p-6 border rounded-lg h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.album?.title || 'Album'} x{item.quantity}</span>
              <span>&#8377;{((item.album?.template_size?.price || 0) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr className="my-3" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>&#8377;{total.toFixed(2)}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={processing}
            className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Place Order & Pay'}
          </button>
        </div>
      </div>
    </div>
  );
}
