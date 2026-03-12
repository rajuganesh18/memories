import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getTemplate } from '../api/templates';
import { useAuth } from '../context/AuthContext';
import SizeSelector from '../components/templates/SizeSelector';

export default function TemplateDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    getTemplate(id)
      .then((res) => setTemplate(res.data))
      .catch(() => toast.error('Template not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCreateAlbum = () => {
    if (!user) {
      toast.error('Please login to create an album');
      navigate('/login');
      return;
    }
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    navigate(`/albums/create?template_size_id=${selectedSize.id}`);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading...</div>;
  }

  if (!template) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400 text-lg">Template not found</p>
        <Link to="/templates" className="text-indigo-600 hover:underline mt-2 inline-block">
          Back to templates
        </Link>
      </div>
    );
  }

  const sampleImages = template.sample_images || [];
  const hasSamples = sampleImages.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/templates" className="text-indigo-600 hover:underline text-sm mb-4 inline-block">
        &larr; Back to templates
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Sample album gallery */}
        <div>
          <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center overflow-hidden relative">
            {hasSamples ? (
              <img
                src={sampleImages[activeImage]?.image_url}
                alt={`${template.name} sample ${activeImage + 1}`}
                className="w-full h-full object-cover"
              />
            ) : template.cover_image_url ? (
              <img
                src={template.cover_image_url}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {template.theme === 'wedding' ? '💒' :
                   template.theme === 'travel' ? '✈️' :
                   template.theme === 'baby' ? '👶' :
                   template.theme === 'birthday' ? '🎂' :
                   template.theme === 'graduation' ? '🎓' : '📸'}
                </div>
                <p className="text-gray-400">No sample images yet</p>
              </div>
            )}

            {/* Prev / Next overlay arrows */}
            {sampleImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((i) => Math.max(0, i - 1))}
                  disabled={activeImage === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 w-8 h-8 rounded-full flex items-center justify-center shadow disabled:opacity-30 transition"
                >
                  &larr;
                </button>
                <button
                  onClick={() => setActiveImage((i) => Math.min(sampleImages.length - 1, i + 1))}
                  disabled={activeImage === sampleImages.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 w-8 h-8 rounded-full flex items-center justify-center shadow disabled:opacity-30 transition"
                >
                  &rarr;
                </button>
              </>
            )}
          </div>

          {/* Page indicator + thumbnails */}
          {sampleImages.length > 1 && (
            <div className="mt-3">
              <p className="text-xs text-gray-400 text-center mb-2">
                {activeImage + 1} of {sampleImages.length}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
                {sampleImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                      idx === activeImage
                        ? 'border-indigo-600'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={`Sample ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Template info */}
        <div>
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full capitalize">
            {template.theme}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-2">
            {template.name}
          </h1>
          <p className="text-gray-600 mb-6">
            {template.description || 'A beautifully designed album template.'}
          </p>

          <div className="flex gap-6 mb-6 text-sm text-gray-500">
            <span>{template.photos_required} photos required</span>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Select Size
          </h2>
          {template.template_sizes?.length > 0 ? (
            <SizeSelector
              sizes={template.template_sizes}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />
          ) : (
            <p className="text-gray-400">No sizes available for this template</p>
          )}

          <button
            onClick={handleCreateAlbum}
            disabled={!selectedSize}
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedSize
              ? `Create Album - ₹${Number(selectedSize.price).toLocaleString('en-IN')}`
              : 'Select a size to continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
