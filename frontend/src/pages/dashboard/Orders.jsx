import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../api/orders';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-taupe font-sans">Loading orders...</div>;

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-terra/10 text-terra',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-olive/10 text-olive',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-brown mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-taupe mb-4 font-sans">You haven't placed any orders yet.</p>
          <Link to="/templates" className="text-terra hover:text-terra-dark font-semibold font-sans">
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/dashboard/orders/${order.id}`}
              className="block bg-warm-white p-5 border border-warm-border rounded-2xl hover:border-terra/30 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm text-taupe font-sans">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-taupe-light font-sans">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                  <p className="mt-1 text-sm font-sans text-taupe">{order.items?.length || 0} item(s)</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize font-sans ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                  </span>
                  <p className="mt-1 font-bold text-terra font-sans">&#8377;{Number(order.total_amount).toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
