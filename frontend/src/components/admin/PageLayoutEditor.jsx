import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Ellipse, Image as KImage, Transformer, Text } from 'react-konva';
import toast from 'react-hot-toast';
import {
  adminUploadPageBackground,
  adminUpdatePageSlots,
  adminDeletePageLayout,
} from '../../api/templates';

const STAGE_WIDTH = 600;
const STAGE_HEIGHT = 450;

const SHAPE_OPTIONS = [
  { value: 'rect', label: 'Rectangle' },
  { value: 'circle', label: 'Circle' },
  { value: 'ellipse', label: 'Ellipse' },
];

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

function SlotShape({ slot, index, isSelected, onSelect, onChange, stageWidth, stageHeight }) {
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

  const shape = slot.shape || 'rect';
  const rotation = slot.rotation || 0;
  const px = toPixel(slot.x, stageWidth);
  const py = toPixel(slot.y, stageHeight);
  const pw = toPixel(slot.width, stageWidth);
  const ph = toPixel(slot.height, stageHeight);

  const handleDragEnd = (e) => {
    onChange(index, {
      ...slot,
      x: toPct(e.target.x(), stageWidth),
      y: toPct(e.target.y(), stageHeight),
    });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    onChange(index, {
      ...slot,
      x: toPct(node.x(), stageWidth),
      y: toPct(node.y(), stageHeight),
      width: toPct(Math.max(20, node.width() * scaleX), stageWidth),
      height: toPct(Math.max(20, node.height() * scaleY), stageHeight),
      rotation: node.rotation(),
    });
  };

  const commonProps = {
    ref: shapeRef,
    fill: shape === 'rect'
      ? 'rgba(99, 102, 241, 0.25)'
      : shape === 'circle'
        ? 'rgba(236, 72, 153, 0.25)'
        : 'rgba(14, 165, 233, 0.25)',
    stroke: shape === 'rect' ? '#6366f1' : shape === 'circle' ? '#ec4899' : '#0ea5e9',
    strokeWidth: 2,
    draggable: true,
    onClick: () => onSelect(index),
    onTap: () => onSelect(index),
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
    rotation,
  };

  const labelColor = shape === 'rect' ? '#4338ca' : shape === 'circle' ? '#be185d' : '#0369a1';

  return (
    <>
      {shape === 'rect' ? (
        <Rect {...commonProps} x={px} y={py} width={pw} height={ph} />
      ) : (
        <Ellipse
          {...commonProps}
          x={px + pw / 2}
          y={py + ph / 2}
          radiusX={pw / 2}
          radiusY={shape === 'circle' ? pw / 2 : ph / 2}
          offsetX={0}
          offsetY={0}
          // Store actual bounds for transformer
          width={pw}
          height={shape === 'circle' ? pw : ph}
        />
      )}
      <Text
        x={px + 4}
        y={py + 4}
        text={`${index + 1} (${shape})`}
        fontSize={11}
        fill={labelColor}
        listening={false}
        rotation={rotation}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          rotateEnabled={true}
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
  const selectedSlotData = selectedSlot !== null ? (layout?.slots || [])[selectedSlot] : null;

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

  const handleAddSlot = (shape = 'rect') => {
    if (!layout) {
      toast.error('Upload a background image first');
      return;
    }
    const newSlot = { x: 10, y: 10, width: 30, height: 30, shape, rotation: 0 };
    if (shape === 'circle') {
      newSlot.height = 30; // will be rendered as equal radius
    }
    const slots = [...(layout.slots || []), newSlot];
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

  const handleDuplicateSlot = () => {
    if (selectedSlot === null || !layout) return;
    const original = layout.slots[selectedSlot];
    const copy = { ...original, x: original.x + 3, y: original.y + 3 };
    const slots = [...layout.slots, copy];
    setLayouts((prev) => ({
      ...prev,
      [currentPage]: { ...prev[currentPage], slots },
    }));
    setSelectedSlot(slots.length - 1);
  };

  const handleUpdateSelectedSlot = (field, value) => {
    if (selectedSlot === null) return;
    const slot = layout.slots[selectedSlot];
    handleSlotChange(selectedSlot, { ...slot, [field]: value });
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
      {/* Page selector */}
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

      <div className="flex gap-4">
        {/* Canvas area */}
        <div className="border rounded-lg overflow-hidden bg-gray-100 flex-shrink-0" style={{ width: STAGE_WIDTH }}>
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
                <SlotShape
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

        {/* Properties panel */}
        {selectedSlotData && (
          <div className="w-52 bg-white border rounded-lg p-3 space-y-3 text-sm self-start">
            <h4 className="font-semibold text-gray-800">Slot {selectedSlot + 1}</h4>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Shape</label>
              <select
                value={selectedSlotData.shape || 'rect'}
                onChange={(e) => handleUpdateSelectedSlot('shape', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                {SHAPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Rotation ({Math.round(selectedSlotData.rotation || 0)}°)</label>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={selectedSlotData.rotation || 0}
                onChange={(e) => handleUpdateSelectedSlot('rotation', Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">X (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={Math.round(selectedSlotData.x * 10) / 10}
                  onChange={(e) => handleUpdateSelectedSlot('x', Number(e.target.value))}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Y (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={Math.round(selectedSlotData.y * 10) / 10}
                  onChange={(e) => handleUpdateSelectedSlot('y', Number(e.target.value))}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">W (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={Math.round(selectedSlotData.width * 10) / 10}
                  onChange={(e) => handleUpdateSelectedSlot('width', Number(e.target.value))}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">H (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={Math.round(selectedSlotData.height * 10) / 10}
                  onChange={(e) => handleUpdateSelectedSlot('height', Number(e.target.value))}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={handleDuplicateSlot}
                className="flex-1 px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition"
              >
                Duplicate
              </button>
              <button
                onClick={handleDeleteSlot}
                className="flex-1 px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap items-center">
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
            <div className="flex border rounded overflow-hidden">
              <button
                onClick={() => handleAddSlot('rect')}
                className="px-3 py-1.5 text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition border-r border-indigo-500"
                title="Add rectangle slot"
              >
                + Rect
              </button>
              <button
                onClick={() => handleAddSlot('circle')}
                className="px-3 py-1.5 text-sm bg-pink-600 text-white hover:bg-pink-700 transition border-r border-pink-500"
                title="Add circle slot"
              >
                + Circle
              </button>
              <button
                onClick={() => handleAddSlot('ellipse')}
                className="px-3 py-1.5 text-sm bg-sky-600 text-white hover:bg-sky-700 transition"
                title="Add ellipse slot"
              >
                + Ellipse
              </button>
            </div>
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
          {(layout.slots || []).length} slot(s) defined. Drag to move, corners to resize, top handle to rotate. Click canvas to deselect.
        </p>
      )}
    </div>
  );
}
