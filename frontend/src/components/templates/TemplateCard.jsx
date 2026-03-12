import { Link } from 'react-router-dom';

export default function TemplateCard({ template }) {
  return (
    <Link
      to={`/templates/${template.id}`}
      className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
        {template.cover_image_url ? (
          <img
            src={template.cover_image_url}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-4">
            <div className="text-4xl mb-2">
              {template.theme === 'wedding' ? '💒' :
               template.theme === 'travel' ? '✈️' :
               template.theme === 'baby' ? '👶' :
               template.theme === 'birthday' ? '🎂' :
               template.theme === 'graduation' ? '🎓' : '📸'}
            </div>
            <p className="text-sm text-gray-400">{template.theme}</p>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
          {template.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {template.description || `${template.photos_required} photos`}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full capitalize">
            {template.theme}
          </span>
          <span className="text-xs text-gray-400">
            {template.photos_required} photos
          </span>
        </div>
      </div>
    </Link>
  );
}
