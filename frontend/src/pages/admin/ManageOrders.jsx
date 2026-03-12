import { useEffect, useState } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api.get('/admin/orders')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="font-serif text-2xl font-bold text-brown mb-6">Manage Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-taupe py-8 font-sans">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-warm-white border border-warm-border rounded-2xl overflow-hidden">
            <thead className="bg-cream-dark">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-taupe font-sans">Order ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-taupe font-sans">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-taupe font-sans">Items</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-taupe font-sans">Total</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-taupe font-sans">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-taupe font-sans">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-warm-border">
                  <td className="px-4 py-3 text-sm font-mono text-brown">{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-sm font-sans text-taupe">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 text-sm font-sans text-taupe">{order.items?.length || 0}</td>
                  <td className="px-4 py-3 text-sm font-semibold font-sans text-terra">&#8377;{Number(order.total_amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize font-sans ${statusColors[order.status] || 'bg-gray-100'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-warm-border rounded-lg px-2 py-1.5 text-sm font-sans bg-cream focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
