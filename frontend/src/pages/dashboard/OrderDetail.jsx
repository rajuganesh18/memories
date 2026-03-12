import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../../api/orders';

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(orderId)
      .then(({ data }) => setOrder(data))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="p-8 text-center text-taupe font-sans">Loading...</div>;
  if (!order) return <div className="p-8 text-center text-terra-dark font-sans">Order not found.</div>;

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-terra/10 text-terra',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-olive/10 text-olive',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/dashboard/orders" className="text-terra hover:text-terra-dark text-sm mb-4 inline-flex items-center gap-1 font-sans font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Orders
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-bold text-brown">Order #{order.id.slice(0, 8)}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize font-sans ${statusColors[order.status] || 'bg-gray-100'}`}>
          {order.status}
        </span>
      </div>

      <div className="bg-warm-white border border-warm-border rounded-2xl p-6 mb-6">
        <h2 className="font-serif font-bold text-brown mb-3">Items</h2>
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b border-warm-border last:border-0 font-sans text-sm">
            <div>
              <p className="font-medium text-brown">Album</p>
              <p className="text-taupe">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium text-brown">&#8377;{Number(item.unit_price).toFixed(2)}</p>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-3 pt-3 border-t border-warm-border font-sans">
          <span className="text-brown">Total</span>
          <span className="text-terra">&#8377;{Number(order.total_amount).toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-warm-white border border-warm-border rounded-2xl p-6 mb-6">
        <h2 className="font-serif font-bold text-brown mb-2">Delivery Address</h2>
        <p className="font-sans text-sm text-taupe">{order.address?.full_name} &middot; {order.address?.phone}</p>
        <p className="text-sm text-taupe font-sans">
          {order.address?.address_line1}{order.address?.address_line2 ? `, ${order.address.address_line2}` : ''}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
        </p>
      </div>

      <div className="bg-warm-white border border-warm-border rounded-2xl p-6">
        <h2 className="font-serif font-bold text-brown mb-2">Order Details</h2>
        <div className="grid grid-cols-2 gap-2 text-sm font-sans">
          <span className="text-taupe">Order ID</span>
          <span className="text-brown">{order.id}</span>
          <span className="text-taupe">Date</span>
          <span className="text-brown">{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
          {order.razorpay_order_id && (
            <>
              <span className="text-taupe">Payment ID</span>
              <span className="text-brown">{order.razorpay_order_id}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
