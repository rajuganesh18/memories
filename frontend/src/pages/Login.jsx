import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-warm-white rounded-2xl border border-warm-border p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-brown">Welcome Back</h1>
          <p className="text-taupe text-sm mt-2 font-sans">Sign in to continue creating your albums</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-brown-light mb-1.5 font-sans">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-warm-border rounded-xl focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none bg-cream font-sans text-sm transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brown-light mb-1.5 font-sans">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-warm-border rounded-xl focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none bg-cream font-sans text-sm transition"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-terra text-white py-3 rounded-full font-semibold hover:bg-terra-dark transition disabled:opacity-50 font-sans tracking-wide"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-taupe mt-8 font-sans">
          Don't have an account?{' '}
          <Link to="/register" className="text-terra hover:text-terra-dark font-semibold">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
