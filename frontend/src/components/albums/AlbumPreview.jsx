import { deletePhoto } from '../../api/albums';
import toast from 'react-hot-toast';

export default function AlbumPreview({ album, onPhotoDeleted }) {
  const template = album.template_size?.template;
  const totalPages = template?.pages_count || 20;
  const photosPerPage = template?.photos_per_page || 1;

  // Group photos by page
  const photosByPage = {};
  (album.photos || []).forEach((p) => {
    if (!photosByPage[p.page_number]) photosByPage[p.page_number] = [];
    photosByPage[p.page_number].push(p);
  });

  const handleDelete = async (photoId) => {
    try {
      await deletePhoto(album.id, photoId);
      onPhotoDeleted(photoId);
      toast.success('Photo removed');
    } catch {
      toast.error('Failed to remove photo');
    }
  };

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">
        Album Preview ({album.photos?.length || 0} photos)
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {(album.photos || []).map((photo) => (
          <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={photo.photo_url}
              alt={`Page ${photo.page_number}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
              <button
                onClick={() => handleDelete(photo.id)}
                className="opacity-0 group-hover:opacity-100 bg-red-500 text-white text-xs px-2 py-1 rounded transition"
              >
                Remove
              </button>
            </div>
            <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">
              P{photo.page_number}
            </span>
          </div>
        ))}
      </div>
      {(album.photos?.length || 0) === 0 && (
        <p className="text-gray-400 text-sm text-center py-8">
          No photos uploaded yet. Use the uploader above to add photos.
        </p>
      )}
      <p className="text-xs text-gray-400 mt-3">
        Template capacity: {totalPages * photosPerPage} photos ({totalPages} pages x {photosPerPage} per page)
      </p>
    </div>
  );
}
