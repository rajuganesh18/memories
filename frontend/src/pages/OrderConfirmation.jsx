import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../api/orders';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(orderId)
      .then(({ data }) => setOrder(data))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="p-8 text-center text-taupe font-sans">Loading order details...</div>;
  if (!order) return <div className="p-8 text-center text-terra-dark font-sans">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <div className="bg-olive/10 border border-olive/30 rounded-2xl p-8 mb-6">
        <div className="w-14 h-14 bg-olive/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="font-serif text-2xl font-bold text-olive mb-2">Order Confirmed!</h1>
        <p className="text-taupe font-sans">Order ID: {order.id}</p>
        <p className="text-taupe font-sans">Status: <span className="font-semibold capitalize">{order.status}</span></p>
      </div>

      <div className="bg-warm-white border border-warm-border rounded-2xl p-6 text-left mb-6">
        <h2 className="font-serif font-bold text-brown mb-3">Order Items</h2>
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b border-warm-border last:border-0 font-sans text-sm text-taupe">
            <span>Album x{item.quantity}</span>
            <span>&#8377;{Number(item.unit_price).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-3 pt-3 border-t border-warm-border font-sans">
          <span className="text-brown">Total</span>
          <span className="text-terra">&#8377;{Number(order.total_amount).toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-warm-white border border-warm-border rounded-2xl p-6 text-left mb-6">
        <h2 className="font-serif font-bold text-brown mb-2">Delivery Address</h2>
        <p className="font-sans text-sm text-taupe">{order.address?.full_name} &middot; {order.address?.phone}</p>
        <p className="text-sm text-taupe font-sans">
          {order.address?.address_line1}{order.address?.address_line2 ? `, ${order.address.address_line2}` : ''}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <Link to="/dashboard/orders" className="bg-terra text-white px-6 py-3 rounded-full hover:bg-terra-dark transition font-sans font-semibold">
          View My Orders
        </Link>
        <Link to="/templates" className="border-2 border-terra text-terra px-6 py-3 rounded-full hover:bg-terra/5 transition font-sans font-semibold">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
