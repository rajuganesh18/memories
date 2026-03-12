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
      <div className="max-w-lg mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Your Album</h1>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Album Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Give your album a name"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={loading || !title.trim()}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
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
          <h1 className="text-2xl font-bold text-gray-900">{album.title}</h1>
          <p className="text-sm text-gray-500">
            {template?.name} &middot; {album.template_size?.size?.label} &middot;
            &#8377;{Number(album.template_size?.price).toLocaleString('en-IN')}
          </p>
        </div>
        {album.status === 'draft' && (
          <button
            onClick={handleComplete}
            disabled={uploadedCount === 0}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            Complete Album
          </button>
        )}
      </div>

      {/* Upload progress */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Photos: {uploadedCount} / {photosRequired}
          </span>
          {remaining > 0 && (
            <span className="text-xs text-gray-400">{remaining} more needed</span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(100, (uploadedCount / photosRequired) * 100)}%` }}
          />
        </div>
      </div>

      {/* Uploaded photos grid */}
      {uploadedPhotos.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Uploaded Photos</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {uploadedPhotos.map((photo) => (
              <img
                key={photo.id}
                src={photo.photo_url}
                alt="Album photo"
                className="w-full aspect-square object-cover rounded-lg border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Upload slots */}
      {album.status === 'draft' && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">
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
                  className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition ${
                    uploading[uploadedCount + i]
                      ? 'border-indigo-300 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                  }`}
                >
                  {uploading[uploadedCount + i] ? (
                    <span className="text-sm text-indigo-500">Uploading...</span>
                  ) : (
                    <>
                      <span className="text-2xl mb-1">+</span>
                      <span className="text-xs text-gray-400">Upload Photo</span>
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
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-green-700 font-medium">Album completed with {uploadedCount} photos</p>
        </div>
      )}
    </div>
  );
}
