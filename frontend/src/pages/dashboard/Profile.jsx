import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/me', form);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-brown mb-6">My Profile</h1>

      <form onSubmit={handleSubmit} className="bg-warm-white border border-warm-border rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-brown-light mb-1.5 font-sans">Email</label>
          <input value={user?.email || ''} disabled
            className="w-full border border-warm-border rounded-xl px-4 py-3 text-sm bg-cream-dark text-taupe font-sans" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brown-light mb-1.5 font-sans">Full Name</label>
          <input value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full border border-warm-border rounded-xl px-4 py-3 text-sm bg-cream font-sans focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brown-light mb-1.5 font-sans">Phone</label>
          <input value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-warm-border rounded-xl px-4 py-3 text-sm bg-cream font-sans focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none" />
        </div>
        <button type="submit" disabled={saving}
          className="bg-terra text-white px-6 py-2.5 rounded-full hover:bg-terra-dark transition disabled:opacity-50 font-sans font-semibold">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
