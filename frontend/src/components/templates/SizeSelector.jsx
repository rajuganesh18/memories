export default function SizeSelector({ sizes, selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {sizes
        .filter((ts) => ts.is_available)
        .map((ts) => (
          <button
            key={ts.id}
            onClick={() => onSelect(ts)}
            className={`p-4 rounded-xl border-2 text-left transition ${
              selected?.id === ts.id
                ? 'border-terra bg-terra/5'
                : 'border-warm-border hover:border-terra/40'
            }`}
          >
            <p className="font-semibold text-brown font-sans">{ts.size.label}</p>
            <p className="text-sm text-taupe font-sans">
              {ts.size.width_inches}" x {ts.size.height_inches}"
            </p>
            <p className="text-lg font-bold text-terra mt-1 font-sans">
              ₹{Number(ts.price).toLocaleString('en-IN')}
            </p>
          </button>
        ))}
    </div>
  );
}
