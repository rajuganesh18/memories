import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-3">Memories</h3>
            <p className="text-sm">
              Beautiful photo albums printed and delivered to your doorstep. Preserve your precious moments forever.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/templates" className="hover:text-white transition">Templates</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Create Account</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard/orders" className="hover:text-white transition">My Orders</Link></li>
              <li><Link to="/dashboard/addresses" className="hover:text-white transition">My Addresses</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Memories. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
