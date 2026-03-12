import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getTemplate } from '../api/templates';
import { useAuth } from '../context/AuthContext';
import SizeSelector from '../components/templates/SizeSelector';
import DoodleOverlay from '../components/templates/DoodleOverlay';

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
    return <div className="p-8 text-center text-taupe-light font-sans">Loading...</div>;
  }

  if (!template) {
    return (
      <div className="p-8 text-center">
        <p className="text-taupe text-lg font-serif">Template not found</p>
        <Link to="/templates" className="text-terra hover:text-terra-dark mt-2 inline-block font-sans text-sm">
          Back to collections
        </Link>
      </div>
    );
  }

  const sampleImages = template.sample_images || [];
  const hasSamples = sampleImages.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/templates" className="text-terra hover:text-terra-dark text-sm mb-6 inline-flex items-center gap-1 font-sans font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to collections
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Sample album gallery */}
        <div>
          <div className="aspect-square bg-white rounded-2xl flex items-center justify-center overflow-hidden relative border border-warm-border">
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
              /* Doodle preview for templates without images */
              <div className="relative w-full h-full flex items-center justify-center">
                <DoodleOverlay theme={template.theme} className="absolute inset-0 w-full h-full opacity-60" />
                <div className="relative z-10 text-center px-8">
                  <div className="w-16 h-px bg-terra/30 mx-auto mb-4" />
                  <p className="font-serif text-2xl font-bold text-brown/70 mb-2">{template.name}</p>
                  <p className="text-taupe-light text-xs font-sans tracking-wider uppercase">Album Template</p>
                  <div className="w-16 h-px bg-terra/30 mx-auto mt-4" />
                  <p className="text-taupe-light/60 text-xs font-sans mt-6">
                    Minimal doodle design on white pages
                  </p>
                </div>
              </div>
            )}

            {/* Prev / Next overlay arrows */}
            {sampleImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((i) => Math.max(0, i - 1))}
                  disabled={activeImage === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brown w-9 h-9 rounded-full flex items-center justify-center shadow-md disabled:opacity-30 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  onClick={() => setActiveImage((i) => Math.min(sampleImages.length - 1, i + 1))}
                  disabled={activeImage === sampleImages.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brown w-9 h-9 rounded-full flex items-center justify-center shadow-md disabled:opacity-30 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {sampleImages.length > 1 && (
            <div className="mt-4">
              <p className="text-xs text-taupe-light text-center mb-2 font-sans">
                {activeImage + 1} of {sampleImages.length}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
                {sampleImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                      idx === activeImage
                        ? 'border-terra'
                        : 'border-transparent hover:border-warm-gray'
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

          {/* Doodle style preview - small pages */}
          {!hasSamples && (
            <div className="mt-6">
              <p className="text-xs text-taupe font-sans font-medium mb-3 text-center">Page Design Preview</p>
              <div className="flex justify-center gap-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="w-20 h-20 bg-white rounded-lg border border-warm-border relative overflow-hidden shadow-sm">
                    <DoodleOverlay theme={template.theme} className="absolute inset-0 w-full h-full opacity-50" />
                    <div className="absolute inset-3 border border-dashed border-taupe-light/30 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-taupe-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Template info */}
        <div>
          <span className="text-xs bg-cream-dark text-taupe px-3 py-1 rounded-full capitalize font-sans font-medium">
            {template.theme}
          </span>
          <h1 className="font-serif text-3xl font-bold text-brown mt-4 mb-3">
            {template.name}
          </h1>
          <p className="text-taupe mb-6 font-sans leading-relaxed">
            {template.description || 'A beautifully designed album template.'}
          </p>

          <div className="bg-cream-dark/50 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-brown font-sans mb-2">What you get</h3>
            <ul className="space-y-1.5 text-sm text-taupe font-sans">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-terra flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Minimal hand-drawn doodle design
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-terra flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {template.photos_required} photo slots on clean white pages
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-terra flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Premium hardcover binding
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-terra flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Book-like preview before ordering
              </li>
            </ul>
          </div>

          <h2 className="font-serif text-lg font-bold text-brown mb-3">
            Select Size
          </h2>
          {template.template_sizes?.length > 0 ? (
            <SizeSelector
              sizes={template.template_sizes}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />
          ) : (
            <p className="text-taupe-light font-sans text-sm">No sizes available for this template</p>
          )}

          <button
            onClick={handleCreateAlbum}
            disabled={!selectedSize}
            className="w-full mt-8 bg-terra text-white py-3.5 rounded-full font-semibold hover:bg-terra-dark transition disabled:opacity-50 disabled:cursor-not-allowed font-sans tracking-wide"
          >
            {selectedSize
              ? `Create Album — ₹${Number(selectedSize.price).toLocaleString('en-IN')}`
              : 'Select a size to continue'}
          </button>

          <div className="mt-6 flex flex-wrap gap-4 text-xs text-taupe font-sans">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-terra" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Free Shipping
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-terra" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Premium Quality
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-terra" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              Happiness Guarantee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
