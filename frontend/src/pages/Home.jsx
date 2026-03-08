import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Preserve Your Precious
            <span className="block text-indigo-200">Memories Forever</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            Create stunning photo albums from our beautifully designed templates.
            Choose a style, upload your photos, and we'll print and deliver your
            album right to your doorstep.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/templates"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition text-lg"
            >
              Browse Templates
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Choose a Template',
              description:
                'Browse our collection of beautifully designed album templates for weddings, travel, baby, and more.',
            },
            {
              step: '2',
              title: 'Upload Your Photos',
              description:
                'Select your favorite photos and we\'ll arrange them in the template layout. Choose your preferred album size.',
            },
            {
              step: '3',
              title: 'Order & Receive',
              description:
                'Place your order, pay securely, and receive your professionally printed album at your doorstep.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="text-center p-6 rounded-xl bg-white shadow-sm"
            >
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
