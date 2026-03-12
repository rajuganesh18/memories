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
      color: 'bg-terra/10 text-terra',
    },
    {
      to: '/admin/orders',
      title: 'Orders',
      description: 'View and manage customer orders',
      stat: stats.orders,
      statLabel: 'total orders',
      color: 'bg-olive/10 text-olive',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-serif text-2xl font-bold text-brown mb-6">Admin Dashboard</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-warm-white p-6 rounded-2xl hover:border-terra/30 transition border border-warm-border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif font-bold text-brown mb-1">{card.title}</h3>
                <p className="text-sm text-taupe font-sans">{card.description}</p>
              </div>
              <div className={`text-right px-3 py-1 rounded-xl ${card.color}`}>
                <p className="text-2xl font-bold font-sans">{card.stat}</p>
                <p className="text-xs font-sans">{card.statLabel}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
