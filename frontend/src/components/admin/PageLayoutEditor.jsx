import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Image as KImage, Transformer, Group, Text } from 'react-konva';
import toast from 'react-hot-toast';
import {
  adminUploadPageBackground,
  adminUpdatePageSlots,
  adminDeletePageLayout,
} from '../../api/templates';

const STAGE_WIDTH = 600;
const STAGE_HEIGHT = 450;

function useImage(url) {
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

function SlotRect({ slot, index, isSelected, onSelect, onChange, stageWidth, stageHeight }) {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const toPixel = (pct, total) => (pct / 100) * total;
  const toPct = (px, total) => (px / total) * 100;

  return (
    <>
      <Rect
        ref={shapeRef}
        x={toPixel(slot.x, stageWidth)}
        y={toPixel(slot.y, stageHeight)}
        width={toPixel(slot.width, stageWidth)}
        height={toPixel(slot.height, stageHeight)}
        fill="rgba(99, 102, 241, 0.25)"
        stroke="#6366f1"
        strokeWidth={2}
        draggable
        onClick={() => onSelect(index)}
        onTap={() => onSelect(index)}
        onDragEnd={(e) => {
          onChange(index, {
            ...slot,
            x: toPct(e.target.x(), stageWidth),
            y: toPct(e.target.y(), stageHeight),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange(index, {
            x: toPct(node.x(), stageWidth),
            y: toPct(node.y(), stageHeight),
            width: toPct(Math.max(20, node.width() * scaleX), stageWidth),
            height: toPct(Math.max(20, node.height() * scaleY), stageHeight),
          });
        }}
      />
      <Text
        x={toPixel(slot.x, stageWidth) + 4}
        y={toPixel(slot.y, stageHeight) + 4}
        text={`Slot ${index + 1}`}
        fontSize={12}
        fill="#4338ca"
        listening={false}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}

export default function PageLayoutEditor({ templateId, pagesCount, existingLayouts, onUpdate }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [layouts, setLayouts] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const map = {};
    (existingLayouts || []).forEach((l) => {
      map[l.page_number] = l;
    });
    setLayouts(map);
  }, [existingLayouts]);

  const layout = layouts[currentPage];
  const bgImage = useImage(layout?.background_image_url);

  const handleUploadBg = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { data } = await adminUploadPageBackground(templateId, currentPage, file);
      setLayouts((prev) => ({ ...prev, [currentPage]: data }));
      onUpdate?.();
      toast.success(`Page ${currentPage} background uploaded`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddSlot = () => {
    if (!layout) {
      toast.error('Upload a background image first');
      return;
    }
    const slots = [...(layout.slots || []), { x: 10, y: 10, width: 30, height: 30 }];
    setLayouts((prev) => ({
      ...prev,
      [currentPage]: { ...prev[currentPage], slots },
    }));
    setSelectedSlot(slots.length - 1);
  };

  const handleSlotChange = useCallback((index, updated) => {
    setLayouts((prev) => {
      const current = prev[currentPage];
      const slots = [...(current.slots || [])];
      slots[index] = updated;
      return { ...prev, [currentPage]: { ...current, slots } };
    });
  }, [currentPage]);

  const handleDeleteSlot = () => {
    if (selectedSlot === null) return;
    setLayouts((prev) => {
      const current = prev[currentPage];
      const slots = (current.slots || []).filter((_, i) => i !== selectedSlot);
      return { ...prev, [currentPage]: { ...current, slots } };
    });
    setSelectedSlot(null);
  };

  const handleSaveSlots = async () => {
    if (!layout) return;
    setSaving(true);
    try {
      const { data } = await adminUpdatePageSlots(templateId, currentPage, layout.slots || []);
      setLayouts((prev) => ({ ...prev, [currentPage]: data }));
      onUpdate?.();
      toast.success('Slots saved');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async () => {
    try {
      await adminDeletePageLayout(templateId, currentPage);
      setLayouts((prev) => {
        const next = { ...prev };
        delete next[currentPage];
        return next;
      });
      onUpdate?.();
      toast.success('Page layout deleted');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Delete failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm font-medium text-gray-700">Page:</label>
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: pagesCount }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => { setCurrentPage(p); setSelectedSlot(null); }}
              className={`w-8 h-8 text-xs rounded transition ${
                p === currentPage
                  ? 'bg-indigo-600 text-white'
                  : layouts[p]
                    ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas area */}
      <div className="border rounded-lg overflow-hidden bg-gray-100" style={{ width: STAGE_WIDTH }}>
        <Stage
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          onClick={(e) => {
            if (e.target === e.target.getStage()) setSelectedSlot(null);
          }}
        >
          <Layer>
            {/* Background */}
            {bgImage ? (
              <KImage image={bgImage} width={STAGE_WIDTH} height={STAGE_HEIGHT} listening={false} />
            ) : (
              <>
                <Rect width={STAGE_WIDTH} height={STAGE_HEIGHT} fill="#f3f4f6" listening={false} />
                <Text
                  x={STAGE_WIDTH / 2 - 80}
                  y={STAGE_HEIGHT / 2 - 10}
                  text="Upload a background"
                  fontSize={16}
                  fill="#9ca3af"
                  listening={false}
                />
              </>
            )}

            {/* Slots */}
            {(layout?.slots || []).map((slot, idx) => (
              <SlotRect
                key={idx}
                slot={slot}
                index={idx}
                isSelected={selectedSlot === idx}
                onSelect={setSelectedSlot}
                onChange={handleSlotChange}
                stageWidth={STAGE_WIDTH}
                stageHeight={STAGE_HEIGHT}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUploadBg}
          className="hidden"
          id="page-bg-upload"
        />
        <label
          htmlFor="page-bg-upload"
          className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded cursor-pointer hover:bg-gray-700 transition"
        >
          {layout ? 'Replace Background' : 'Upload Background'}
        </label>

        {layout && (
          <>
            <button
              onClick={handleAddSlot}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              + Add Slot
            </button>
            {selectedSlot !== null && (
              <button
                onClick={handleDeleteSlot}
                className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete Slot
              </button>
            )}
            <button
              onClick={handleSaveSlots}
              disabled={saving}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Slots'}
            </button>
            <button
              onClick={handleDeletePage}
              className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
            >
              Delete Page Layout
            </button>
          </>
        )}
      </div>

      {layout && (
        <p className="text-xs text-gray-400">
          {(layout.slots || []).length} slot(s) defined. Drag to position, resize from corners. Click stage background to deselect.
        </p>
      )}
    </div>
  );
}
