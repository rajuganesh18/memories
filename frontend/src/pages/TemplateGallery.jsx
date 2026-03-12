import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTemplates } from '../api/templates';
import TemplateCard from '../components/templates/TemplateCard';

const THEMES = ['all', 'wedding', 'travel', 'baby', 'birthday', 'graduation', 'family'];

export default function TemplateGallery() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTheme = searchParams.get('theme') || 'all';

  useEffect(() => {
    setLoading(true);
    const theme = activeTheme === 'all' ? null : activeTheme;
    getTemplates(theme)
      .then((res) => setTemplates(res.data))
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, [activeTheme]);

  const handleThemeChange = (theme) => {
    if (theme === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ theme });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <p className="text-terra text-sm font-medium tracking-[0.15em] uppercase mb-3 font-sans">Our Collections</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-3">Album Templates</h1>
        <p className="text-taupe font-sans max-w-lg mx-auto">
          Choose a template to start creating your premium photo album
        </p>
      </div>

      {/* Theme filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {THEMES.map((theme) => (
          <button
            key={theme}
            onClick={() => handleThemeChange(theme)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition capitalize font-sans ${
              activeTheme === theme
                ? 'bg-terra text-white'
                : 'bg-cream-dark text-taupe hover:bg-warm-gray'
            }`}
          >
            {theme}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-taupe-light font-sans">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-taupe text-lg font-serif">No templates found</p>
          <p className="text-taupe-light text-sm mt-2 font-sans">
            Try a different theme or check back later
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
