import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  adminGetTemplates,
  adminCreateTemplate,
  adminUpdateTemplate,
  adminDeleteTemplate,
  adminGetSizes,
  adminCreateSize,
  adminCreateTemplateSize,
} from '../../api/templates';

export default function ManageTemplates() {
  const [templates, setTemplates] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showSizeForm, setShowSizeForm] = useState(false);
  const [showPricingForm, setShowPricingForm] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', theme: 'wedding', pages_count: 20, photos_per_page: 1,
  });
  const [sizeForm, setSizeForm] = useState({
    label: '', width_inches: '', height_inches: '',
  });
  const [pricingForm, setPricingForm] = useState({ size_id: '', price: '' });

  const loadData = () => {
    adminGetTemplates().then((r) => setTemplates(r.data)).catch(() => {});
    adminGetSizes().then((r) => setSizes(r.data)).catch(() => {});
  };

  useEffect(() => { loadData(); }, []);

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      await adminCreateTemplate(form);
      toast.success('Template created');
      setShowForm(false);
      setForm({ name: '', description: '', theme: 'wedding', pages_count: 20, photos_per_page: 1 });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create template');
    }
  };

  const handleToggleActive = async (t) => {
    await adminUpdateTemplate(t.id, { is_active: !t.is_active });
    loadData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this template?')) return;
    await adminDeleteTemplate(id);
    toast.success('Template deleted');
    loadData();
  };

  const handleCreateSize = async (e) => {
    e.preventDefault();
    try {
      await adminCreateSize({
        ...sizeForm,
        width_inches: Number(sizeForm.width_inches),
        height_inches: Number(sizeForm.height_inches),
      });
      toast.success('Size created');
      setShowSizeForm(false);
      setSizeForm({ label: '', width_inches: '', height_inches: '' });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create size');
    }
  };

  const handleAddPricing = async (e) => {
    e.preventDefault();
    try {
      await adminCreateTemplateSize({
        template_id: showPricingForm,
        size_id: pricingForm.size_id,
        price: Number(pricingForm.price),
      });
      toast.success('Pricing added');
      setShowPricingForm(null);
      setPricingForm({ size_id: '', price: '' });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add pricing');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Templates</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSizeForm(!showSizeForm)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm"
          >
            {showSizeForm ? 'Cancel' : '+ Add Size'}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
          >
            {showForm ? 'Cancel' : '+ New Template'}
          </button>
        </div>
      </div>

      {/* Size form */}
      {showSizeForm && (
        <form onSubmit={handleCreateSize} className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Label</label>
            <input value={sizeForm.label} onChange={(e) => setSizeForm({ ...sizeForm, label: e.target.value })} required className="px-3 py-2 border rounded-lg text-sm" placeholder='e.g., 8x8 inches' />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Width (in)</label>
            <input type="number" step="0.1" value={sizeForm.width_inches} onChange={(e) => setSizeForm({ ...sizeForm, width_inches: e.target.value })} required className="px-3 py-2 border rounded-lg text-sm w-24" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Height (in)</label>
            <input type="number" step="0.1" value={sizeForm.height_inches} onChange={(e) => setSizeForm({ ...sizeForm, height_inches: e.target.value })} required className="px-3 py-2 border rounded-lg text-sm w-24" />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Create Size</button>
        </form>
      )}

      {/* Available sizes */}
      {sizes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Available Sizes:</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <span key={s.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                {s.label} ({s.width_inches}" x {s.height_inches}")
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Template form */}
      {showForm && (
        <form onSubmit={handleCreateTemplate} className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                {['wedding', 'travel', 'baby', 'birthday', 'graduation', 'family'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
              <input type="number" value={form.pages_count} onChange={(e) => setForm({ ...form, pages_count: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photos per page</label>
              <input type="number" value={form.photos_per_page} onChange={(e) => setForm({ ...form, photos_per_page: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg">Create Template</button>
        </form>
      )}

      {/* Templates list */}
      <div className="space-y-4">
        {templates.map((t) => (
          <div key={t.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{t.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${t.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {t.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full capitalize">{t.theme}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{t.description || 'No description'} &middot; {t.pages_count} pages</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowPricingForm(showPricingForm === t.id ? null : t.id)} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-100">
                  + Price
                </button>
                <button onClick={() => handleToggleActive(t)} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200">
                  {t.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-lg hover:bg-red-100">
                  Delete
                </button>
              </div>
            </div>

            {/* Pricing form for this template */}
            {showPricingForm === t.id && (
              <form onSubmit={handleAddPricing} className="mt-3 flex gap-3 items-end border-t pt-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Size</label>
                  <select value={pricingForm.size_id} onChange={(e) => setPricingForm({ ...pricingForm, size_id: e.target.value })} required className="px-3 py-2 border rounded-lg text-sm">
                    <option value="">Select size</option>
                    {sizes.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Price (INR)</label>
                  <input type="number" step="0.01" value={pricingForm.price} onChange={(e) => setPricingForm({ ...pricingForm, price: e.target.value })} required className="px-3 py-2 border rounded-lg text-sm w-32" />
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Add</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
