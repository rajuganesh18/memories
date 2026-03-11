import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getTemplate } from '../api/templates';
import { useAuth } from '../context/AuthContext';
import SizeSelector from '../components/templates/SizeSelector';
import CanvasAlbumPage from '../components/albums/CanvasAlbumPage';

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
  const pageLayouts = template.page_layouts || [];
  const hasPageLayouts = pageLayouts.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/templates" className="text-indigo-600 hover:underline text-sm mb-4 inline-block">
        &larr; Back to templates
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Template preview / sample gallery with page navigation */}
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
                <p className="text-gray-400">Template preview</p>
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
                Page {activeImage + 1} of {sampleImages.length}
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
            <span>{template.pages_count} pages</span>
            <span>{template.photos_per_page} photo(s) per page</span>
            <span>
              Up to {template.pages_count * template.photos_per_page} photos
            </span>
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

      {/* Canvas-based album page preview */}
      {hasPageLayouts && (
        <TemplatePagePreview pageLayouts={pageLayouts} sampleImages={sampleImages} />
      )}
    </div>
  );
}

function TemplatePagePreview({ pageLayouts, sampleImages }) {
  const [activePage, setActivePage] = useState(0);
  const layout = pageLayouts[activePage];

  // Map sample images into the page slots for preview
  const samplePhotos = [];
  if (layout) {
    let imgIdx = 0;
    // Use sample images as filler for the slots
    for (let p = 0; p < pageLayouts.length; p++) {
      if (p === activePage) {
        for (let s = 0; s < (layout.slots?.length || 0); s++) {
          if (sampleImages[imgIdx]) {
            samplePhotos.push({
              photo_url: sampleImages[imgIdx].image_url,
              position: s,
            });
          }
          imgIdx++;
        }
        break;
      }
      imgIdx += pageLayouts[p].slots?.length || 0;
    }
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Album Page Preview</h2>
      <p className="text-sm text-gray-500 mb-4">
        See how your photos will look on each page of this album template.
      </p>

      <CanvasAlbumPage
        layout={layout}
        photos={samplePhotos}
        width={Math.min(700, window.innerWidth - 80)}
        readOnly
      />

      {pageLayouts.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setActivePage((p) => Math.max(0, p - 1))}
            disabled={activePage === 0}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition"
          >
            &larr; Prev
          </button>
          <span className="text-sm text-gray-500">
            Page {layout?.page_number} ({activePage + 1} of {pageLayouts.length})
          </span>
          <button
            onClick={() => setActivePage((p) => Math.min(pageLayouts.length - 1, p + 1))}
            disabled={activePage === pageLayouts.length - 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
