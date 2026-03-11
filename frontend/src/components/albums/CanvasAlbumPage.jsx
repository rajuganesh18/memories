import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Ellipse, Image as KImage, Group, Text } from 'react-konva';

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
 * Supports rect, circle, and ellipse slot shapes with rotation.
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

    // Find which slot the drop landed in (bounding box hit test)
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
            const shape = slot.shape || 'rect';
            const rotation = slot.rotation || 0;
            const sx = toPixel(slot.x, width);
            const sy = toPixel(slot.y, height);
            const sw = toPixel(slot.width, width);
            const sh = shape === 'circle' ? sw : toPixel(slot.height, height);
            const photoData = photoImages[idx];

            // Center point for rotation
            const cx = sx + sw / 2;
            const cy = sy + sh / 2;

            return (
              <Group
                key={idx}
                x={cx}
                y={cy}
                rotation={rotation}
                clipFunc={shape === 'rect' ? undefined : (ctx) => {
                  ctx.beginPath();
                  const rx = sw / 2;
                  const ry = sh / 2;
                  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
                  ctx.closePath();
                }}
                clipX={shape === 'rect' ? -sw / 2 : undefined}
                clipY={shape === 'rect' ? -sh / 2 : undefined}
                clipWidth={shape === 'rect' ? sw : undefined}
                clipHeight={shape === 'rect' ? sh : undefined}
              >
                {/* Slot background placeholder */}
                {shape === 'rect' ? (
                  <Rect
                    x={-sw / 2}
                    y={-sh / 2}
                    width={sw}
                    height={sh}
                    fill={photoData ? undefined : '#e5e7eb'}
                    stroke={photoData ? undefined : '#d1d5db'}
                    strokeWidth={photoData ? 0 : 1}
                    dash={photoData ? undefined : [4, 4]}
                    listening={false}
                  />
                ) : (
                  <Ellipse
                    x={0}
                    y={0}
                    radiusX={sw / 2}
                    radiusY={sh / 2}
                    fill={photoData ? undefined : '#e5e7eb'}
                    stroke={photoData ? undefined : '#d1d5db'}
                    strokeWidth={photoData ? 0 : 1}
                    dash={photoData ? undefined : [4, 4]}
                    listening={false}
                  />
                )}

                {photoData ? (
                  <KImage
                    image={photoData.img}
                    x={-sw / 2}
                    y={-sh / 2}
                    width={sw}
                    height={sh}
                    listening={!readOnly}
                    draggable={!readOnly}
                  />
                ) : (
                  <Text
                    x={-20}
                    y={-8}
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
