import { Link } from 'react-router-dom';
import DoodleOverlay from './DoodleOverlay';

export default function TemplateCard({ template }) {
  return (
    <Link
      to={`/templates/${template.id}`}
      className="group bg-warm-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-warm-border"
    >
      <div className="aspect-[4/3] bg-white flex items-center justify-center overflow-hidden relative">
        {template.cover_image_url ? (
          <img
            src={template.cover_image_url}
            alt={template.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Minimal doodle cover */
          <div className="relative w-full h-full flex items-center justify-center">
            <DoodleOverlay theme={template.theme} className="absolute inset-0 w-full h-full opacity-70" />
            <div className="relative z-10 text-center px-4">
              <div className="w-10 h-px bg-terra/30 mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-brown/80">{template.name}</p>
              <p className="text-xs text-taupe-light mt-1 font-sans capitalize">{template.theme}</p>
              <div className="w-10 h-px bg-terra/30 mx-auto mt-3" />
            </div>
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
