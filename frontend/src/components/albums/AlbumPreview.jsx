import { deletePhoto } from '../../api/albums';
import toast from 'react-hot-toast';
import AlbumPageView from './AlbumPageView';

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

  // Build pages for the AlbumPageView
  // Only include pages that have at least one photo, plus show all pages up to max used
  const maxUsedPage = Math.max(
    ...Object.keys(photosByPage).map(Number),
    0
  );
  const pagesToShow = Math.max(maxUsedPage, 1);

  const pages = [];
  for (let p = 1; p <= pagesToShow; p++) {
    const pagePhotos = photosByPage[p] || [];
    const slots = [];
    for (let s = 0; s < photosPerPage; s++) {
      const photo = pagePhotos.find((ph) => ph.position === s) || pagePhotos[s] || null;
      slots.push({ position: s, photo });
    }
    pages.push({ pageNumber: p, slots });
  }

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">
        Album Preview ({album.photos?.length || 0} photos)
      </h3>

      {(album.photos?.length || 0) === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
          No photos uploaded yet. Use the uploader above to add photos.
        </p>
      ) : (
        <AlbumPageView
          pages={pages}
          photosPerPage={photosPerPage}
          totalPages={totalPages}
          onDeletePhoto={handleDelete}
        />
      )}

      <p className="text-xs text-gray-400 mt-3">
        Template capacity: {totalPages * photosPerPage} photos ({totalPages} pages x {photosPerPage} per page)
      </p>
    </div>
  );
}
