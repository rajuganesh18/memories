import { useState } from 'react';

/**
 * Renders an album in a book-like page view.
 *
 * Props:
 * - pages: array of page objects: { pageNumber, slots }
 *   where slots is an array of { photo (url or null), position }
 * - photosPerPage: number of photo slots per page
 * - totalPages: total number of pages
 * - onDeletePhoto: optional (photoId) => void, enables delete buttons
 * - readOnly: if true, hide empty slot placeholders
 */
export default function AlbumPageView({
  pages,
  photosPerPage,
  totalPages,
  onDeletePhoto,
  readOnly = false,
}) {
  const [currentPage, setCurrentPage] = useState(0);

  const pageData = pages[currentPage];

  const gridClass =
    photosPerPage === 1
      ? 'grid-cols-1'
      : photosPerPage === 2
        ? 'grid-cols-2'
        : photosPerPage <= 4
          ? 'grid-cols-2'
          : 'grid-cols-3';

  return (
    <div>
      {/* Book page display */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-4 sm:p-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
            Page {pages[currentPage]?.pageNumber || currentPage + 1} of {totalPages}
          </span>
        </div>

        {/* Page content - album page simulation */}
        <div className="bg-white rounded-lg shadow-md aspect-[4/3] p-3 sm:p-4 flex items-center justify-center">
          {pageData && pageData.slots.some((s) => s.photo) ? (
            <div className={`grid ${gridClass} gap-2 sm:gap-3 w-full h-full`}>
              {pageData.slots.map((slot, idx) => (
                <div
                  key={idx}
                  className="relative rounded-md overflow-hidden bg-gray-100 flex items-center justify-center group"
                >
                  {slot.photo ? (
                    <>
                      <img
                        src={slot.photo.photo_url || slot.photo.image_url || slot.photo}
                        alt={`Page ${pageData.pageNumber}, position ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {onDeletePhoto && slot.photo.id && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                          <button
                            onClick={() => onDeletePhoto(slot.photo.id)}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white text-xs px-2 py-1 rounded transition"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </>
                  ) : !readOnly ? (
                    <div className="text-gray-300 text-xs text-center p-2">
                      <div className="text-2xl mb-1">+</div>
                      <span>Empty slot</span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-50" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300 text-sm">No photos on this page</p>
          )}
        </div>
      </div>

      {/* Page navigation */}
      {pages.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            &larr; Prev
          </button>

          <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-xs px-1">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`flex-shrink-0 w-7 h-7 text-xs rounded-md transition ${
                  idx === currentPage
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(pages.length - 1, p + 1))}
            disabled={currentPage === pages.length - 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
