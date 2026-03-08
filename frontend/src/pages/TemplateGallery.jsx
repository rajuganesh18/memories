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
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Album Templates</h1>
      <p className="text-gray-500 mb-8">
        Choose a template to start creating your album
      </p>

      {/* Theme filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {THEMES.map((theme) => (
          <button
            key={theme}
            onClick={() => handleThemeChange(theme)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize ${
              activeTheme === theme
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {theme}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No templates found</p>
          <p className="text-gray-300 text-sm mt-1">
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
