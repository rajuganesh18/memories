import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, templates: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/admin/orders').catch(() => ({ data: [] })),
      api.get('/templates/').catch(() => ({ data: [] })),
    ]).then(([ordersRes, templatesRes]) => {
      setStats({
        orders: ordersRes.data.length,
        templates: templatesRes.data.length,
      });
    });
  }, []);

  const cards = [
    {
      to: '/admin/templates',
      title: 'Templates',
      description: 'Manage album templates, sizes, and pricing',
      stat: stats.templates,
      statLabel: 'active templates',
      color: 'bg-indigo-50 text-indigo-700',
    },
    {
      to: '/admin/orders',
      title: 'Orders',
      description: 'View and manage customer orders',
      stat: stats.orders,
      statLabel: 'total orders',
      color: 'bg-green-50 text-green-700',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.description}</p>
              </div>
              <div className={`text-right px-3 py-1 rounded-lg ${card.color}`}>
                <p className="text-2xl font-bold">{card.stat}</p>
                <p className="text-xs">{card.statLabel}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
