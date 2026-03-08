export default function SizeSelector({ sizes, selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {sizes
        .filter((ts) => ts.is_available)
        .map((ts) => (
          <button
            key={ts.id}
            onClick={() => onSelect(ts)}
            className={`p-4 rounded-lg border-2 text-left transition ${
              selected?.id === ts.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <p className="font-medium text-gray-900">{ts.size.label}</p>
            <p className="text-sm text-gray-500">
              {ts.size.width_inches}" x {ts.size.height_inches}"
            </p>
            <p className="text-lg font-bold text-indigo-600 mt-1">
              ₹{Number(ts.price).toLocaleString('en-IN')}
            </p>
          </button>
        ))}
    </div>
  );
}
