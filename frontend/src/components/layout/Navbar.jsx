import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600" onClick={closeMenu}>
            Memories
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/templates" className="text-gray-700 hover:text-indigo-600 transition">
              Templates
            </Link>

            {user ? (
              <>
                <Link to="/cart" className="relative text-gray-700 hover:text-indigo-600 transition">
                  Cart
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link to="/dashboard/orders" className="text-gray-700 hover:text-indigo-600 transition">
                  My Orders
                </Link>
                {user.is_admin && (
                  <Link to="/admin" className="text-gray-700 hover:text-indigo-600 transition">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <Link to="/dashboard/profile" className="text-sm text-gray-500 hover:text-indigo-600">
                    {user.full_name}
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 transition">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg absolute w-full z-50">
          <div className="px-4 py-3 space-y-2">
            <Link to="/templates" onClick={closeMenu} className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              Templates
            </Link>

            {user ? (
              <>
                <Link to="/cart" onClick={closeMenu} className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                  Cart {itemCount > 0 && `(${itemCount})`}
                </Link>
                <Link to="/dashboard/orders" onClick={closeMenu} className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                  My Orders
                </Link>
                <Link to="/dashboard/addresses" onClick={closeMenu} className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                  Addresses
                </Link>
                <Link to="/dashboard/profile" onClick={closeMenu} className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                  Profile
                </Link>
                {user.is_admin && (
                  <Link to="/admin" onClick={closeMenu} className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                    Admin
                  </Link>
                )}
                <hr className="my-2" />
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-500">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                  Login
                </Link>
                <Link to="/register" onClick={closeMenu} className="block px-3 py-2 rounded-lg bg-indigo-600 text-white text-center hover:bg-indigo-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
