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
  adminUploadSampleImage,
  adminDeleteSampleImage,
  getTemplate,
} from '../../api/templates';

export default function ManageTemplates() {
  const [templates, setTemplates] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showSizeForm, setShowSizeForm] = useState(false);
  const [showPricingForm, setShowPricingForm] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', theme: 'wedding', photos_required: 20,
  });
  const [sizeForm, setSizeForm] = useState({
    label: '', width_inches: '', height_inches: '',
  });
  const [pricingForm, setPricingForm] = useState({ size_id: '', price: '' });
  const [samplePanel, setSamplePanel] = useState(null);
  const [sampleImages, setSampleImages] = useState([]);
  const [uploading, setUploading] = useState(false);

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
      setForm({ name: '', description: '', theme: 'wedding', photos_required: 20 });
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

  const loadSampleImages = async (templateId) => {
    try {
      const res = await getTemplate(templateId);
      setSampleImages(res.data.sample_images || []);
    } catch {
      setSampleImages([]);
    }
  };

  const toggleSamplePanel = (templateId) => {
    if (samplePanel === templateId) {
      setSamplePanel(null);
      setSampleImages([]);
    } else {
      setSamplePanel(templateId);
      loadSampleImages(templateId);
    }
  };

  const handleUploadSample = async (templateId, files) => {
    setUploading(true);
    try {
      for (const file of files) {
        await adminUploadSampleImage(templateId, file);
      }
      toast.success(`${files.length} sample image(s) uploaded`);
      loadSampleImages(templateId);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSample = async (templateId, imageId) => {
    if (!confirm('Delete this sample image?')) return;
    try {
      await adminDeleteSampleImage(templateId, imageId);
      toast.success('Sample image deleted');
      loadSampleImages(templateId);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Delete failed');
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photos Required</label>
            <input type="number" min="1" value={form.photos_required} onChange={(e) => setForm({ ...form, photos_required: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
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
                <p className="text-sm text-gray-500 mt-1">{t.description || 'No description'} &middot; {t.photos_required} photos required</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleSamplePanel(t.id)} className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-100">
                  {samplePanel === t.id ? 'Hide Samples' : 'Samples'}
                </button>
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

            {/* Sample images panel */}
            {samplePanel === t.id && (
              <div className="mt-3 border-t pt-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Sample Album Images</h4>
                  <label className={`text-xs bg-purple-600 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-purple-700 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploading ? 'Uploading...' : '+ Upload Images'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          handleUploadSample(t.id, Array.from(e.target.files));
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>
                </div>
                {sampleImages.length === 0 ? (
                  <p className="text-xs text-gray-400">No sample images yet. Upload images to show customers what this album looks like.</p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {sampleImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.image_url}
                          alt="Sample"
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleDeleteSample(t.id, img.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
