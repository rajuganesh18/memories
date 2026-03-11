import { useEffect, useState } from 'react';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../../api/addresses';
import toast from 'react-hot-toast';

const emptyForm = {
  full_name: '', phone: '', address_line1: '', address_line2: '',
  city: '', state: '', pincode: '', is_default: false,
};

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const fetchAddresses = () => {
    getAddresses()
      .then(({ data }) => setAddresses(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateAddress(editing, form);
        toast.success('Address updated');
      } else {
        await createAddress(form);
        toast.success('Address added');
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      fetchAddresses();
    } catch {
      toast.error('Failed to save address');
    }
  };

  const handleEdit = (addr) => {
    setEditing(addr.id);
    setForm({
      full_name: addr.full_name, phone: addr.phone,
      address_line1: addr.address_line1, address_line2: addr.address_line2 || '',
      city: addr.city, state: addr.state, pincode: addr.pincode, is_default: addr.is_default,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      toast.success('Address deleted');
      fetchAddresses();
    } catch {
      toast.error('Failed to delete address');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
            Add Address
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 mb-6 space-y-3">
          <h2 className="font-semibold">{editing ? 'Edit Address' : 'New Address'}</h2>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Full Name" required value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="border rounded px-3 py-2 text-sm" />
            <input placeholder="Phone" required value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="border rounded px-3 py-2 text-sm" />
          </div>
          <input placeholder="Address Line 1" required value={form.address_line1}
            onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm" />
          <input placeholder="Address Line 2 (optional)" value={form.address_line2}
            onChange={(e) => setForm({ ...form, address_line2: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm" />
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="City" required value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="border rounded px-3 py-2 text-sm" />
            <input placeholder="State" required value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="border rounded px-3 py-2 text-sm" />
            <input placeholder="Pincode" required value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="border rounded px-3 py-2 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_default}
              onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
            Default address
          </label>
          <div className="flex gap-2">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">
              {editing ? 'Update' : 'Save'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
              className="text-gray-500 text-sm">Cancel</button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <p className="text-center text-gray-500 py-8">No addresses saved yet.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {addr.full_name}
                    {addr.is_default && <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Default</span>}
                  </p>
                  <p className="text-sm text-gray-500">{addr.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(addr)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</button>
                  <button onClick={() => handleDelete(addr.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
