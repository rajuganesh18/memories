import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-warm-white rounded-2xl border border-warm-border p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-brown">Create Account</h1>
          <p className="text-taupe text-sm mt-2 font-sans">Start preserving your precious memories</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-brown-light mb-1.5 font-sans">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              required
              value={form.full_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-warm-border rounded-xl focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none bg-cream font-sans text-sm transition"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brown-light mb-1.5 font-sans">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-warm-border rounded-xl focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none bg-cream font-sans text-sm transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brown-light mb-1.5 font-sans">
              Phone (optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-warm-border rounded-xl focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none bg-cream font-sans text-sm transition"
              placeholder="+91 9876543210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brown-light mb-1.5 font-sans">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-warm-border rounded-xl focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none bg-cream font-sans text-sm transition"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-terra text-white py-3 rounded-full font-semibold hover:bg-terra-dark transition disabled:opacity-50 font-sans tracking-wide"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-taupe mt-8 font-sans">
          Already have an account?{' '}
          <Link to="/login" className="text-terra hover:text-terra-dark font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
