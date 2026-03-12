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
    <nav className="bg-warm-white/80 backdrop-blur-md border-b border-warm-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center">
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <span className="font-serif text-2xl font-bold text-brown tracking-tight">Memories</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/templates" className="text-brown-light hover:text-terra transition text-sm font-medium tracking-wide uppercase">
              Collections
            </Link>

            {user ? (
              <>
                <Link to="/cart" className="relative text-brown-light hover:text-terra transition text-sm font-medium tracking-wide uppercase">
                  Cart
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-terra text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-sans">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link to="/dashboard/orders" className="text-brown-light hover:text-terra transition text-sm font-medium tracking-wide uppercase">
                  Orders
                </Link>
                {user.is_admin && (
                  <Link to="/admin" className="text-brown-light hover:text-terra transition text-sm font-medium tracking-wide uppercase">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-warm-border">
                  <Link to="/dashboard/profile" className="text-sm text-taupe hover:text-terra font-medium">
                    {user.full_name}
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-taupe-light hover:text-terra-dark transition font-medium">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-brown-light hover:text-terra transition text-sm font-medium">
                  Sign In
                </Link>
                <Link to="/register" className="bg-terra text-white px-5 py-2.5 rounded-full hover:bg-terra-dark transition text-sm font-medium tracking-wide">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-cream-dark"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="md:hidden bg-warm-white border-t border-warm-border shadow-lg absolute w-full z-50">
          <div className="px-4 py-3 space-y-1">
            <Link to="/templates" onClick={closeMenu} className="block px-3 py-2.5 rounded-lg hover:bg-cream-dark text-brown-light font-medium text-sm">
              Collections
            </Link>

            {user ? (
              <>
                <Link to="/cart" onClick={closeMenu} className="block px-3 py-2.5 rounded-lg hover:bg-cream-dark text-brown-light font-medium text-sm">
                  Cart {itemCount > 0 && `(${itemCount})`}
                </Link>
                <Link to="/dashboard/orders" onClick={closeMenu} className="block px-3 py-2.5 rounded-lg hover:bg-cream-dark text-brown-light font-medium text-sm">
                  My Orders
                </Link>
                <Link to="/dashboard/addresses" onClick={closeMenu} className="block px-3 py-2.5 rounded-lg hover:bg-cream-dark text-brown-light font-medium text-sm">
                  Addresses
                </Link>
                <Link to="/dashboard/profile" onClick={closeMenu} className="block px-3 py-2.5 rounded-lg hover:bg-cream-dark text-brown-light font-medium text-sm">
                  Profile
                </Link>
                {user.is_admin && (
                  <Link to="/admin" onClick={closeMenu} className="block px-3 py-2.5 rounded-lg hover:bg-cream-dark text-brown-light font-medium text-sm">
                    Admin
                  </Link>
                )}
                <hr className="my-2 border-warm-border" />
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 rounded-lg hover:bg-cream-dark text-terra-dark font-medium text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="block px-3 py-2.5 rounded-lg hover:bg-cream-dark text-brown-light font-medium text-sm">
                  Sign In
                </Link>
                <Link to="/register" onClick={closeMenu} className="block px-3 py-2.5 rounded-lg bg-terra text-white text-center font-medium text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
