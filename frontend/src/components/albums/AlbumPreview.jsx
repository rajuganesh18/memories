import { useState } from 'react';
import { deletePhoto } from '../../api/albums';
import toast from 'react-hot-toast';
import AlbumPageView from './AlbumPageView';
import CanvasAlbumPage from './CanvasAlbumPage';

export default function AlbumPreview({ album, onPhotoDeleted, pageLayouts = [] }) {
  const template = album.template_size?.template;
  const totalPages = template?.pages_count || 20;
  const photosPerPage = template?.photos_per_page || 1;
  const hasCanvasLayouts = pageLayouts.length > 0;

  const [previewPage, setPreviewPage] = useState(0);

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

  // For canvas mode: show pages that have layouts
  if (hasCanvasLayouts && (album.photos?.length || 0) > 0) {
    const pagesWithContent = pageLayouts.filter(
      (l) => photosByPage[l.page_number]?.length > 0
    );
    const pagesToRender = pagesWithContent.length > 0 ? pagesWithContent : [pageLayouts[0]];
    const current = pagesToRender[previewPage] || pagesToRender[0];

    return (
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">
          Album Preview ({album.photos?.length || 0} photos)
        </h3>

        <CanvasAlbumPage
          layout={current}
          photos={photosByPage[current?.page_number] || []}
          width={Math.min(650, window.innerWidth - 80)}
          readOnly
        />

        {/* Page navigation */}
        {pagesToRender.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setPreviewPage((p) => Math.max(0, p - 1))}
              disabled={previewPage === 0}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition"
            >
              &larr; Prev
            </button>
            <span className="text-sm text-gray-500">
              Page {current?.page_number} ({previewPage + 1} of {pagesToRender.length})
            </span>
            <button
              onClick={() => setPreviewPage((p) => Math.min(pagesToRender.length - 1, p + 1))}
              disabled={previewPage === pagesToRender.length - 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition"
            >
              Next &rarr;
            </button>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-3">
          Template capacity: {totalPages * photosPerPage} photos ({totalPages} pages x {photosPerPage} per page)
        </p>
      </div>
    );
  }

  // Fallback: non-canvas page view
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
