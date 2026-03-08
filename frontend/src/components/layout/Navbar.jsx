import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            Memories
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/templates"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Templates
            </Link>

            {user ? (
              <>
                <Link
                  to="/cart"
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  Cart
                </Link>
                <Link
                  to="/dashboard/orders"
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  My Orders
                </Link>
                {user.is_admin && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-indigo-600 transition"
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {user.full_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:text-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
