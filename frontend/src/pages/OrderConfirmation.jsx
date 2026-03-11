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

  if (loading) return <div className="p-8 text-center">Loading order details...</div>;
  if (!order) return <div className="p-8 text-center text-red-500">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-6">
        <div className="text-4xl mb-4">&#10003;</div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Order ID: {order.id}</p>
        <p className="text-gray-600">Status: <span className="font-medium capitalize">{order.status}</span></p>
      </div>

      <div className="bg-white border rounded-lg p-6 text-left mb-6">
        <h2 className="font-semibold mb-3">Order Items</h2>
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
            <span>Album x{item.quantity}</span>
            <span>&#8377;{Number(item.unit_price).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-3 pt-3 border-t">
          <span>Total</span>
          <span>&#8377;{Number(order.total_amount).toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 text-left mb-6">
        <h2 className="font-semibold mb-2">Delivery Address</h2>
        <p>{order.address?.full_name} &middot; {order.address?.phone}</p>
        <p className="text-sm text-gray-600">
          {order.address?.address_line1}{order.address?.address_line2 ? `, ${order.address.address_line2}` : ''}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <Link to="/dashboard/orders" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
          View My Orders
        </Link>
        <Link to="/templates" className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
