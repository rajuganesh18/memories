import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createAlbum, getAlbum, completeAlbum, uploadPhoto } from '../api/albums';
import { useCart } from '../context/CartContext';
import BookPreview from '../components/albums/BookPreview';

const STEPS = [
  { num: 1, label: 'Create' },
  { num: 2, label: 'Upload' },
  { num: 3, label: 'Preview' },
];

export default function AlbumBuilder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateSizeId = searchParams.get('template_size_id');
  const albumIdParam = searchParams.get('album_id');

  const { addToCart } = useCart();
  const [album, setAlbum] = useState(null);
  const [title, setTitle] = useState('My Album');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({});
  const [step, setStep] = useState(1); // 1=create, 2=upload, 3=preview

  useEffect(() => {
    if (albumIdParam) {
      getAlbum(albumIdParam)
        .then((res) => {
          setAlbum(res.data);
          setStep(res.data.status === 'completed' ? 3 : 2);
        })
        .catch(() => toast.error('Album not found'));
    }
  }, [albumIdParam]);

  const handleCreate = async () => {
    if (!templateSizeId) {
      toast.error('No template selected');
      navigate('/templates');
      return;
    }
    setLoading(true);
    try {
      const res = await createAlbum({ template_size_id: templateSizeId, title });
      setAlbum(res.data);
      setStep(2);
      toast.success('Album created!');
      window.history.replaceState(null, '', `/albums/create?album_id=${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create album');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (index, file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setUploading((prev) => ({ ...prev, [index]: true }));
    try {
      const res = await uploadPhoto(album.id, file, 1, index);
      setAlbum((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), res.data],
      }));
      toast.success('Photo uploaded');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleMultiUpload = async (files) => {
    const uploadedCount = album.photos?.length || 0;
    for (let i = 0; i < files.length; i++) {
      await handlePhotoUpload(uploadedCount + i, files[i]);
    }
  };

  const handleComplete = async () => {
    try {
      const res = await completeAlbum(album.id);
      setAlbum(res.data);
      await addToCart(res.data.id);
      toast.success('Album completed and added to cart!');
      navigate('/cart');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to complete album');
    }
  };

  const template = album?.template_size?.template;
  const theme = template?.theme || 'baby';
  const photosRequired = template?.photos_required || 20;
  const uploadedPhotos = album?.photos || [];
  const uploadedCount = uploadedPhotos.length;
  const remaining = Math.max(0, photosRequired - uploadedCount);
  const currentStep = !album ? 1 : step;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <button
              onClick={() => album && s.num <= 3 && (s.num === 3 ? uploadedCount > 0 : true) && setStep(s.num)}
              disabled={!album || (s.num === 1) || (s.num === 3 && uploadedCount === 0)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans font-medium transition ${
                currentStep === s.num
                  ? 'bg-terra text-white'
                  : currentStep > s.num
                  ? 'bg-terra/10 text-terra'
                  : 'bg-cream-dark text-taupe-light'
              } ${album && s.num !== 1 ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                currentStep > s.num ? 'bg-terra text-white' : currentStep === s.num ? 'bg-white/20 text-white' : 'bg-warm-gray text-taupe-light'
              }`}>
                {currentStep > s.num ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-px ${currentStep > s.num ? 'bg-terra' : 'bg-warm-gray'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Create album */}
      {currentStep === 1 && (
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <p className="text-terra text-sm font-medium tracking-[0.15em] uppercase mb-3 font-sans">Step 1</p>
            <h1 className="font-serif text-3xl font-bold text-brown">Name Your Album</h1>
            <p className="text-taupe text-sm mt-2 font-sans">Give your album a title that captures the moment</p>
          </div>
          <div className="bg-warm-white p-8 rounded-2xl border border-warm-border">
            <div className="mb-6">
              <label className="block text-sm font-medium text-brown-light mb-2 font-sans">
                Album Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-warm-border rounded-xl focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none bg-cream font-sans text-lg text-center"
                placeholder="My precious memories..."
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={loading || !title.trim()}
              className="w-full bg-terra text-white py-3.5 rounded-full font-semibold hover:bg-terra-dark transition disabled:opacity-50 font-sans tracking-wide"
            >
              {loading ? 'Creating...' : 'Create Album'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Upload photos */}
      {currentStep === 2 && album && (
        <div>
          <div className="text-center mb-8">
            <p className="text-terra text-sm font-medium tracking-[0.15em] uppercase mb-3 font-sans">Step 2</p>
            <h1 className="font-serif text-3xl font-bold text-brown">{album.title}</h1>
            <p className="text-taupe text-sm mt-2 font-sans">
              {template?.name} &middot; {album.template_size?.size?.label} &middot;
              &#8377;{Number(album.template_size?.price).toLocaleString('en-IN')}
            </p>
          </div>

          {/* Upload progress */}
          <div className="bg-warm-white p-5 rounded-2xl border border-warm-border mb-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-brown font-sans">
                Photos: {uploadedCount} / {photosRequired}
              </span>
              {remaining > 0 && (
                <span className="text-xs text-taupe-light font-sans">{remaining} more needed</span>
              )}
            </div>
            <div className="w-full bg-cream-dark rounded-full h-2">
              <div
                className="bg-terra h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (uploadedCount / photosRequired) * 100)}%` }}
              />
            </div>
          </div>

          {/* Uploaded photos grid — larger previews to show clarity */}
          {uploadedPhotos.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {uploadedPhotos.map((photo, idx) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.photo_url}
                      alt={`Photo ${idx + 1}`}
                      className="w-full aspect-[4/3] object-cover rounded-xl border border-warm-border"
                      style={{ imageRendering: 'high-quality' }}
                    />
                    <span className="absolute bottom-1 right-1 bg-brown/60 text-white text-[9px] px-1.5 py-0.5 rounded-full font-sans opacity-0 group-hover:opacity-100 transition">
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload area */}
          {album.status === 'draft' && (
            <div className="bg-warm-white p-8 rounded-2xl border-2 border-dashed border-warm-border hover:border-terra/40 transition text-center max-w-2xl mx-auto">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="photo-upload-input"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    handleMultiUpload(Array.from(e.target.files));
                    e.target.value = '';
                  }
                }}
              />
              <label htmlFor="photo-upload-input" className="cursor-pointer block">
                <div className="w-14 h-14 bg-cream-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-taupe-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-sans font-semibold text-brown mb-1">
                  {Object.values(uploading).some(Boolean) ? 'Uploading...' : 'Click to upload photos'}
                </p>
                <p className="text-xs text-taupe font-sans">
                  Select multiple photos at once &middot; {remaining > 0 ? `${remaining} more needed` : 'You can add more if you like'}
                </p>
                <p className="text-[10px] text-taupe-light font-sans mt-1">
                  Images are automatically enhanced to ultra-high resolution for print quality
                </p>
              </label>
            </div>
          )}

          {/* Action buttons */}
          {uploadedCount > 0 && album.status === 'draft' && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setStep(3)}
                className="bg-cream-dark text-brown px-8 py-3 rounded-full font-sans font-semibold hover:bg-warm-gray transition"
              >
                Preview Album
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Book Preview */}
      {currentStep === 3 && album && (
        <div>
          <div className="text-center mb-8">
            <p className="text-terra text-sm font-medium tracking-[0.15em] uppercase mb-3 font-sans">Step 3</p>
            <h1 className="font-serif text-3xl font-bold text-brown">Preview Your Album</h1>
            <p className="text-taupe text-sm mt-2 font-sans">
              Flip through your album like a real book
            </p>
          </div>

          <BookPreview
            photos={uploadedPhotos}
            theme={theme}
            albumTitle={album.title}
          />

          {/* Action buttons */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={() => setStep(2)}
              className="border-2 border-warm-border text-brown px-6 py-3 rounded-full font-sans font-semibold hover:bg-cream-dark transition"
            >
              Back to Upload
            </button>
            {album.status === 'draft' && (
              <button
                onClick={handleComplete}
                className="bg-terra text-white px-8 py-3 rounded-full font-sans font-semibold hover:bg-terra-dark transition"
              >
                Complete & Add to Cart
              </button>
            )}
          </div>

          {album.status === 'completed' && (
            <div className="bg-olive/10 border border-olive/30 rounded-2xl p-5 text-center mt-6 max-w-md mx-auto">
              <p className="text-olive font-semibold font-sans">Album completed with {uploadedCount} photos</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
