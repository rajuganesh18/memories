import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/dashboard/orders', label: 'Orders' },
  { to: '/dashboard/addresses', label: 'Addresses' },
  { to: '/dashboard/profile', label: 'Profile' },
];

export default function DashboardLayout() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex gap-4 border-b mb-6 pb-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-medium rounded-t transition ${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`
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
