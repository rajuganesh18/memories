import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createAlbum, getAlbum, completeAlbum, uploadPhoto } from '../api/albums';
import { useCart } from '../context/CartContext';

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

  useEffect(() => {
    if (albumIdParam) {
      getAlbum(albumIdParam)
        .then((res) => setAlbum(res.data))
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

  // Step 1: Create album
  if (!album) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <p className="text-terra text-sm font-medium tracking-[0.15em] uppercase mb-3 font-sans">Step 1</p>
          <h1 className="font-serif text-3xl font-bold text-brown">Create Your Album</h1>
        </div>
        <div className="bg-warm-white p-6 rounded-2xl border border-warm-border">
          <div className="mb-5">
            <label className="block text-sm font-medium text-brown-light mb-1.5 font-sans">
              Album Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-warm-border rounded-xl focus:ring-2 focus:ring-terra/30 focus:border-terra outline-none bg-cream font-sans text-sm"
              placeholder="Give your album a name"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={loading || !title.trim()}
            className="w-full bg-terra text-white py-3 rounded-full font-semibold hover:bg-terra-dark transition disabled:opacity-50 font-sans tracking-wide"
          >
            {loading ? 'Creating...' : 'Create Album'}
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Upload photos
  const template = album.template_size?.template;
  const photosRequired = template?.photos_required || 20;
  const uploadedPhotos = album.photos || [];
  const uploadedCount = uploadedPhotos.length;
  const remaining = Math.max(0, photosRequired - uploadedCount);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brown">{album.title}</h1>
          <p className="text-sm text-taupe font-sans mt-1">
            {template?.name} &middot; {album.template_size?.size?.label} &middot;
            &#8377;{Number(album.template_size?.price).toLocaleString('en-IN')}
          </p>
        </div>
        {album.status === 'draft' && (
          <button
            onClick={handleComplete}
            disabled={uploadedCount === 0}
            className="bg-olive text-white px-6 py-2.5 rounded-full font-semibold hover:bg-olive-light transition disabled:opacity-50 font-sans text-sm"
          >
            Complete Album
          </button>
        )}
      </div>

      {/* Upload progress */}
      <div className="bg-warm-white p-5 rounded-2xl border border-warm-border mb-6">
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
            className="bg-terra h-2 rounded-full transition-all"
            style={{ width: `${Math.min(100, (uploadedCount / photosRequired) * 100)}%` }}
          />
        </div>
      </div>

      {/* Uploaded photos grid */}
      {uploadedPhotos.length > 0 && (
        <div className="mb-6">
          <h2 className="font-serif font-bold text-brown mb-3">Uploaded Photos</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {uploadedPhotos.map((photo) => (
              <img
                key={photo.id}
                src={photo.photo_url}
                alt="Album photo"
                className="w-full aspect-square object-cover rounded-xl border border-warm-border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Upload slots */}
      {album.status === 'draft' && (
        <div className="bg-warm-white p-6 rounded-2xl border border-warm-border">
          <h2 className="font-serif font-bold text-brown mb-4">
            Upload Photos {remaining > 0 ? `(${remaining} remaining)` : ''}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: Math.max(remaining, 1) }, (_, i) => (
              <div key={`upload-${uploadedCount + i}`}>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`upload-slot-${i}`}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handlePhotoUpload(uploadedCount + i, file);
                      e.target.value = '';
                    }
                  }}
                />
                <label
                  htmlFor={`upload-slot-${i}`}
                  className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition ${
                    uploading[uploadedCount + i]
                      ? 'border-terra/40 bg-terra/5'
                      : 'border-warm-border hover:border-terra/40 hover:bg-cream-dark'
                  }`}
                >
                  {uploading[uploadedCount + i] ? (
                    <span className="text-sm text-terra font-sans">Uploading...</span>
                  ) : (
                    <>
                      <svg className="w-6 h-6 text-taupe-light mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                      <span className="text-xs text-taupe-light font-sans">Upload Photo</span>
                    </>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed status */}
      {album.status === 'completed' && (
        <div className="bg-olive/10 border border-olive/30 rounded-2xl p-5 text-center">
          <p className="text-olive font-semibold font-sans">Album completed with {uploadedCount} photos</p>
        </div>
      )}
    </div>
  );
}
