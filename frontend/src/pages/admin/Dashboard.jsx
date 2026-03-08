import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/admin/templates"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
        >
          <h3 className="font-semibold text-gray-900 mb-1">Templates</h3>
          <p className="text-sm text-gray-500">
            Manage album templates, sizes, and pricing
          </p>
        </Link>
        <Link
          to="/admin/orders"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
        >
          <h3 className="font-semibold text-gray-900 mb-1">Orders</h3>
          <p className="text-sm text-gray-500">
            View and manage customer orders
          </p>
        </Link>
      </div>
    </div>
  );
}
