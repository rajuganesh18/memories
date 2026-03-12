import { Link } from 'react-router-dom';

export default function TemplateCard({ template }) {
  return (
    <Link
      to={`/templates/${template.id}`}
      className="group bg-warm-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-warm-border"
    >
      <div className="aspect-[4/3] bg-cream-dark flex items-center justify-center overflow-hidden">
        {template.cover_image_url ? (
          <img
            src={template.cover_image_url}
            alt={template.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-warm-gray/50 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-8 h-8 text-taupe-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-taupe-light capitalize font-sans">{template.theme}</p>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-serif font-bold text-brown group-hover:text-terra transition text-lg">
          {template.name}
        </h3>
        <p className="text-sm text-taupe mt-1.5 line-clamp-2 font-sans leading-relaxed">
          {template.description || `${template.photos_required} photos`}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs bg-cream-dark text-taupe px-3 py-1 rounded-full capitalize font-sans font-medium">
            {template.theme}
          </span>
          <span className="text-xs text-taupe-light font-sans">
            {template.photos_required} photos
          </span>
        </div>
      </div>
    </Link>
  );
}
