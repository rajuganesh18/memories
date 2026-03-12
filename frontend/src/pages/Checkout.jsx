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
        <p className="text-taupe font-sans">Your cart is empty.</p>
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

      if (!window.Razorpay) {
        toast.error('Payment gateway not loaded. Please refresh and try again.');
        return;
      }
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
      <h1 className="font-serif text-2xl font-bold text-brown mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Address selection */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-serif text-lg font-bold text-brown">Delivery Address</h2>

          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`block p-4 border rounded-xl cursor-pointer transition ${selectedAddress === addr.id ? 'border-terra bg-terra/5' : 'border-warm-border hover:border-terra/40'}`}
            >
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedAddress === addr.id}
                onChange={() => setSelectedAddress(addr.id)}
                className="mr-2 accent-terra"
              />
              <span className="font-semibold text-brown font-sans">{addr.full_name}</span>
              <span className="text-sm text-taupe ml-2 font-sans">{addr.phone}</span>
              <p className="text-sm text-taupe mt-1 font-sans">
                {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
            </label>
          ))}

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="text-terra hover:text-terra-dark text-sm font-semibold font-sans"
            >
              + Add New Address
            </button>
          )}

          {showForm && (
            <form onSubmit={handleAddAddress} className="bg-warm-white p-5 border border-warm-border rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Full Name" required value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="border border-warm-border rounded-lg px-3 py-2.5 text-sm font-sans bg-cream focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none"
                />
                <input
                  placeholder="Phone" required value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="border border-warm-border rounded-lg px-3 py-2.5 text-sm font-sans bg-cream focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none"
                />
              </div>
              <input
                placeholder="Address Line 1" required value={form.address_line1}
                onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
                className="w-full border border-warm-border rounded-lg px-3 py-2.5 text-sm font-sans bg-cream focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none"
              />
              <input
                placeholder="Address Line 2 (optional)" value={form.address_line2}
                onChange={(e) => setForm({ ...form, address_line2: e.target.value })}
                className="w-full border border-warm-border rounded-lg px-3 py-2.5 text-sm font-sans bg-cream focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  placeholder="City" required value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="border border-warm-border rounded-lg px-3 py-2.5 text-sm font-sans bg-cream focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none"
                />
                <input
                  placeholder="State" required value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="border border-warm-border rounded-lg px-3 py-2.5 text-sm font-sans bg-cream focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none"
                />
                <input
                  placeholder="Pincode" required value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="border border-warm-border rounded-lg px-3 py-2.5 text-sm font-sans bg-cream focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none"
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-sans text-taupe">
                <input
                  type="checkbox" checked={form.is_default}
                  onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                  className="accent-terra"
                />
                Set as default address
              </label>
              <div className="flex gap-2">
                <button type="submit" className="bg-terra text-white px-5 py-2.5 rounded-full text-sm hover:bg-terra-dark font-sans font-semibold">
                  Save Address
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-taupe text-sm font-sans">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order summary */}
        <div className="bg-warm-white p-6 border border-warm-border rounded-2xl h-fit">
          <h2 className="font-serif text-lg font-bold text-brown mb-4">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2 font-sans text-taupe">
              <span>{item.album?.title || 'Album'} x{item.quantity}</span>
              <span>&#8377;{((item.album?.template_size?.price || 0) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr className="my-3 border-warm-border" />
          <div className="flex justify-between font-bold font-sans">
            <span className="text-brown">Total</span>
            <span className="text-terra">&#8377;{total.toFixed(2)}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={processing}
            className="w-full mt-5 bg-terra text-white py-3.5 rounded-full hover:bg-terra-dark transition disabled:opacity-50 font-sans font-semibold tracking-wide"
          >
            {processing ? 'Processing...' : 'Place Order & Pay'}
          </button>
        </div>
      </div>
    </div>
  );
}
