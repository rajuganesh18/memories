import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Image as KImage, Group, Text } from 'react-konva';

function useLoadImage(url) {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!url) { setImage(null); return; }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.src = url;
  }, [url]);
  return image;
}

/**
 * Renders a single album page on a Konva canvas.
 * Shows the template background with user photos clipped to the defined slots.
 *
 * Props:
 * - layout: { background_image_url, slots: [{x,y,width,height}] }
 * - photos: array of photo objects for this page, each with { photo_url, position }
 * - width: canvas display width
 * - readOnly: if true, no drag/interaction (for previews)
 * - onPhotoDropped: (slotIndex, file) => void — for drop-to-upload
 */
export default function CanvasAlbumPage({ layout, photos = [], width = 600, readOnly = false, onPhotoDropped }) {
  const height = Math.round(width * 0.75); // 4:3 aspect
  const bgImage = useLoadImage(layout?.background_image_url);
  const stageRef = useRef();

  // Load all photo images
  const photoImages = {};
  photos.forEach((p) => {
    const img = useLoadImage(p.photo_url || p.image_url);
    if (img) photoImages[p.position ?? p.sort_order ?? 0] = { img, photo: p };
  });

  const toPixel = (pct, total) => (pct / 100) * total;

  // Handle drag-and-drop from outside
  const handleDrop = (e) => {
    if (readOnly || !onPhotoDropped) return;
    e.preventDefault();
    const stage = stageRef.current;
    stage.setPointersPositions(e);
    const pos = stage.getPointerPosition();

    // Find which slot the drop landed in
    const slots = layout?.slots || [];
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      const sx = toPixel(s.x, width);
      const sy = toPixel(s.y, height);
      const sw = toPixel(s.width, width);
      const sh = toPixel(s.height, height);
      if (pos.x >= sx && pos.x <= sx + sw && pos.y >= sy && pos.y <= sy + sh) {
        const files = e.dataTransfer?.files;
        if (files?.length > 0) {
          onPhotoDropped(i, files[0]);
        }
        return;
      }
    }
  };

  if (!layout) {
    return (
      <div
        className="bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm"
        style={{ width, height }}
      >
        No page layout defined
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Stage ref={stageRef} width={width} height={height}>
        <Layer>
          {/* Background */}
          {bgImage ? (
            <KImage image={bgImage} width={width} height={height} listening={false} />
          ) : (
            <Rect width={width} height={height} fill="#f9fafb" listening={false} />
          )}

          {/* Photo slots */}
          {(layout.slots || []).map((slot, idx) => {
            const sx = toPixel(slot.x, width);
            const sy = toPixel(slot.y, height);
            const sw = toPixel(slot.width, width);
            const sh = toPixel(slot.height, height);
            const photoData = photoImages[idx];

            return (
              <Group
                key={idx}
                clipX={sx}
                clipY={sy}
                clipWidth={sw}
                clipHeight={sh}
              >
                {/* Slot background */}
                <Rect
                  x={sx}
                  y={sy}
                  width={sw}
                  height={sh}
                  fill={photoData ? undefined : '#e5e7eb'}
                  stroke={photoData ? undefined : '#d1d5db'}
                  strokeWidth={photoData ? 0 : 1}
                  dash={photoData ? undefined : [4, 4]}
                  listening={false}
                />

                {photoData ? (
                  <KImage
                    image={photoData.img}
                    x={sx}
                    y={sy}
                    width={sw}
                    height={sh}
                    listening={!readOnly}
                    draggable={!readOnly}
                    dragBoundFunc={(pos) => {
                      // Constrain within slot area
                      return {
                        x: Math.min(sx, Math.max(sx + sw - sw, pos.x)),
                        y: Math.min(sy, Math.max(sy + sh - sh, pos.y)),
                      };
                    }}
                  />
                ) : (
                  <Text
                    x={sx + sw / 2 - 20}
                    y={sy + sh / 2 - 8}
                    text={readOnly ? '' : `Slot ${idx + 1}`}
                    fontSize={12}
                    fill="#9ca3af"
                    listening={false}
                  />
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
