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

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!order) return <div className="p-8 text-center text-red-500">Order not found.</div>;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/dashboard/orders" className="text-indigo-600 hover:text-indigo-800 text-sm mb-4 block">
        &larr; Back to Orders
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
        <span className={`px-3 py-1 rounded text-sm font-medium capitalize ${statusColors[order.status] || 'bg-gray-100'}`}>
          {order.status}
        </span>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-3">Items</h2>
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
            <div>
              <p className="font-medium">Album</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">&#8377;{Number(item.unit_price).toFixed(2)}</p>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-3 pt-3 border-t">
          <span>Total</span>
          <span>&#8377;{Number(order.total_amount).toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-2">Delivery Address</h2>
        <p>{order.address?.full_name} &middot; {order.address?.phone}</p>
        <p className="text-sm text-gray-600">
          {order.address?.address_line1}{order.address?.address_line2 ? `, ${order.address.address_line2}` : ''}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
        </p>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold mb-2">Order Details</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-500">Order ID</span>
          <span>{order.id}</span>
          <span className="text-gray-500">Date</span>
          <span>{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
          {order.razorpay_order_id && (
            <>
              <span className="text-gray-500">Payment ID</span>
              <span>{order.razorpay_order_id}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
