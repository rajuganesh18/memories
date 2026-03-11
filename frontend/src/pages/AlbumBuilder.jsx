import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createAlbum, getAlbum, completeAlbum } from '../api/albums';
import PhotoUploader from '../components/albums/PhotoUploader';
import AlbumPreview from '../components/albums/AlbumPreview';

export default function AlbumBuilder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateSizeId = searchParams.get('template_size_id');
  const albumIdParam = searchParams.get('album_id');

  const [album, setAlbum] = useState(null);
  const [title, setTitle] = useState('My Album');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
      // Update URL without full reload
      window.history.replaceState(null, '', `/albums/create?album_id=${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create album');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUploaded = (photo) => {
    setAlbum((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), photo],
    }));
  };

  const handlePhotoDeleted = (photoId) => {
    setAlbum((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== photoId),
    }));
  };

  const handleComplete = async () => {
    try {
      const res = await completeAlbum(album.id);
      setAlbum(res.data);
      toast.success('Album completed! You can now add it to your cart.');
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
  const totalPages = template?.pages_count || 20;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{album.title}</h1>
          <p className="text-sm text-gray-500">
            {template?.name} &middot; {album.template_size?.size?.label} &middot;
            ₹{Number(album.template_size?.price).toLocaleString('en-IN')}
          </p>
        </div>
        {album.status === 'draft' && (
          <button
            onClick={handleComplete}
            disabled={(album.photos?.length || 0) === 0}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            Complete Album
          </button>
        )}
      </div>

      {/* Photo upload area */}
      {album.status === 'draft' && (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Upload Photos</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Page:</label>
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="px-2 py-1 border rounded text-sm"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>Page {p}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: template?.photos_per_page || 1 }, (_, i) => (
              <PhotoUploader
                key={`${currentPage}-${i}`}
                albumId={album.id}
                pageNumber={currentPage}
                position={i}
                onUploaded={handlePhotoUploaded}
              />
            ))}
          </div>
        </div>
      )}

      {/* Album preview */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <AlbumPreview
          album={album}
          onPhotoDeleted={handlePhotoDeleted}
        />
      </div>
    </div>
  );
}
