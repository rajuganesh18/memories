import { useState } from 'react';
import DoodleOverlay from '../templates/DoodleOverlay';

/**
 * Book-like preview that shows uploaded photos compiled with
 * the album template doodle overlays. Designed to look and feel
 * like flipping through a real photo album.
 *
 * Layout: 2 photos per spread (left + right page), with doodle
 * borders around each photo. Single pages on cover/back.
 */
export default function BookPreview({ photos = [], theme = 'baby', albumTitle = 'My Album' }) {
  const [currentSpread, setCurrentSpread] = useState(0);

  // Build pages: cover + photo pages + back cover
  const photoPages = photos.map((photo, i) => ({
    type: 'photo',
    photo,
    pageNum: i + 1,
  }));

  // Group into spreads (2 per spread for open book view)
  const spreads = [];

  // Spread 0: Cover
  spreads.push({ type: 'cover' });

  // Photo spreads (2 photos per spread = left page + right page)
  for (let i = 0; i < photoPages.length; i += 2) {
    spreads.push({
      type: 'spread',
      left: photoPages[i],
      right: photoPages[i + 1] || null,
    });
  }

  // Back cover
  spreads.push({ type: 'back' });

  const totalSpreads = spreads.length;
  const current = spreads[currentSpread];

  const goNext = () => setCurrentSpread((s) => Math.min(s + 1, totalSpreads - 1));
  const goPrev = () => setCurrentSpread((s) => Math.max(s - 1, 0));

  return (
    <div className="flex flex-col items-center">
      {/* Book container */}
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Book shadow */}
        <div className="absolute inset-0 bg-brown/5 rounded-2xl blur-xl translate-y-4 scale-95" />

        {/* Book body */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-warm-gray/50">
          {current.type === 'cover' ? (
            <CoverPage title={albumTitle} theme={theme} />
          ) : current.type === 'back' ? (
            <BackCover photoCount={photos.length} />
          ) : (
            <SpreadView
              left={current.left}
              right={current.right}
              theme={theme}
            />
          )}
        </div>

        {/* Spine line for spreads */}
        {current.type === 'spread' && (
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-warm-gray/40 z-10" />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={goPrev}
          disabled={currentSpread === 0}
          className="w-10 h-10 rounded-full border border-warm-border flex items-center justify-center text-brown hover:bg-cream-dark transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page dots */}
        <div className="flex gap-2">
          {spreads.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSpread(i)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                i === currentSpread ? 'bg-terra scale-110' : 'bg-warm-gray hover:bg-taupe-light'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentSpread === totalSpreads - 1}
          className="w-10 h-10 rounded-full border border-warm-border flex items-center justify-center text-brown hover:bg-cream-dark transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-taupe-light mt-3 font-sans">
        {currentSpread === 0
          ? 'Cover'
          : currentSpread === totalSpreads - 1
          ? 'Back Cover'
          : `Pages ${(currentSpread - 1) * 2 + 1}–${Math.min((currentSpread - 1) * 2 + 2, photos.length)} of ${photos.length}`}
      </p>
    </div>
  );
}

function CoverPage({ title, theme }) {
  return (
    <div className="relative aspect-[2/1.3] sm:aspect-[2/1.2] flex items-center justify-center bg-white">
      {/* Full-page doodle pattern (subtle) */}
      <DoodleOverlay theme={theme} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Cover content */}
      <div className="relative z-10 text-center px-8">
        <div className="w-16 h-px bg-terra/40 mx-auto mb-4" />
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brown mb-2">{title}</h2>
        <p className="text-taupe-light text-xs sm:text-sm font-sans tracking-[0.15em] uppercase">A Collection of Memories</p>
        <div className="w-16 h-px bg-terra/40 mx-auto mt-4" />
      </div>
    </div>
  );
}

function BackCover({ photoCount }) {
  return (
    <div className="relative aspect-[2/1.3] sm:aspect-[2/1.2] flex items-center justify-center bg-white">
      <div className="text-center px-8">
        <p className="font-serif text-lg sm:text-xl text-brown mb-1">Memories</p>
        <p className="text-taupe-light text-xs font-sans">{photoCount} moments preserved</p>
        <div className="w-10 h-px bg-warm-gray mx-auto mt-4" />
      </div>
    </div>
  );
}

function SpreadView({ left, right, theme }) {
  return (
    <div className="grid grid-cols-2 aspect-[2/1.3] sm:aspect-[2/1.2]">
      {/* Left page */}
      <div className="relative bg-white border-r border-warm-gray/30">
        {left ? (
          <PhotoPage photo={left.photo} pageNum={left.pageNum} theme={theme} />
        ) : (
          <EmptyPage theme={theme} />
        )}
      </div>

      {/* Right page */}
      <div className="relative bg-white">
        {right ? (
          <PhotoPage photo={right.photo} pageNum={right.pageNum} theme={theme} />
        ) : (
          <EmptyPage theme={theme} />
        )}
      </div>
    </div>
  );
}

function PhotoPage({ photo, pageNum, theme }) {
  return (
    <div className="relative w-full h-full p-4 sm:p-8 flex flex-col">
      {/* Doodle overlay behind photo */}
      <DoodleOverlay theme={theme} className="absolute inset-0 w-full h-full opacity-30" />

      {/* Photo frame */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="w-full h-full max-w-[85%] max-h-[85%] relative">
          <img
            src={photo.photo_url}
            alt={`Page ${pageNum}`}
            className="w-full h-full object-cover rounded-lg shadow-sm"
          />
        </div>
      </div>

      {/* Page number */}
      <p className="relative z-10 text-center text-[10px] sm:text-xs text-taupe-light/60 font-sans mt-2">
        {pageNum}
      </p>
    </div>
  );
}

function EmptyPage({ theme }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <DoodleOverlay theme={theme} className="absolute inset-0 w-full h-full opacity-20" />
    </div>
  );
}
