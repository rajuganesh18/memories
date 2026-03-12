import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/dashboard/orders', label: 'Orders' },
  { to: '/dashboard/addresses', label: 'Addresses' },
  { to: '/dashboard/profile', label: 'Profile' },
];

export default function DashboardLayout() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex gap-4 border-b border-warm-border mb-8 pb-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium rounded-t transition font-sans ${isActive ? 'text-terra border-b-2 border-terra' : 'text-taupe hover:text-brown'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
