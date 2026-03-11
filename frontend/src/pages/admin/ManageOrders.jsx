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

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Order ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Items</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-3 text-sm font-mono">{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-sm">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 text-sm">{order.items?.length || 0}</td>
                  <td className="px-4 py-3 text-sm font-medium">&#8377;{Number(order.total_amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
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
