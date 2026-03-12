import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { theme: 'baby', title: 'First Year', desc: 'Cherish every milestone of their precious first year' },
  { theme: 'wedding', title: 'Wedding', desc: 'Relive your most magical day, page by page' },
  { theme: 'travel', title: 'Travel', desc: 'Turn your adventures into stories that last forever' },
  { theme: 'birthday', title: 'Birthday', desc: 'Celebrate every candle, every smile, every moment' },
  { theme: 'family', title: 'Family', desc: 'Your family story, beautifully bound together' },
  { theme: 'graduation', title: 'Graduation', desc: 'Mark achievements with a keepsake to treasure' },
];

const STEPS = [
  {
    num: '01',
    title: 'Choose Your Theme',
    description: 'Browse our curated collection of professionally designed album templates for every occasion.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Upload Your Photos',
    description: 'Simply select your favourite photos. We arrange them beautifully in your chosen layout.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Receive Your Album',
    description: 'We print, bind, and deliver your premium album right to your doorstep.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    title: 'Premium Print Quality',
    desc: 'Ultra HD printing on archival-grade paper with rich, true-to-life colours that last a lifetime.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    title: 'Tear & Spill Safe',
    desc: 'Premium non-tearable, moisture-resistant pages with silky matte lamination — built to last.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Hardcover Binding',
    desc: 'Seamless laminar binding with no loose pages — your memories stay perfectly bound together.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Free Pan-India Delivery',
    desc: 'Every album ships free across India. Carefully packaged to arrive in perfect condition.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya M.',
    text: "Created my baby's entire first year album in one evening — from hospital photos to her first birthday. It's priceless.",
    location: 'Bangalore',
  },
  {
    name: 'Arun K.',
    text: 'The print quality is honestly unreal. Crisp, vibrant, and so sharp. Every page feels premium.',
    location: 'Mumbai',
  },
  {
    name: 'Sneha R.',
    text: 'Non-tearable and stain-safe pages are a huge win for us parents. Our toddler flips through it daily!',
    location: 'Delhi',
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brown via-brown-light to-taupe opacity-95" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32 sm:px-6 lg:px-8 text-center">
          <p className="text-terra-light text-sm font-medium tracking-[0.2em] uppercase mb-4 font-sans">Premium Photo Albums</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Stories,<br />
            <span className="text-terra-light">Beautifully Bound</span>
          </h1>
          <p className="text-lg sm:text-xl text-cream-dark/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed font-sans">
            Handcrafted photo albums that turn your favourite moments into timeless keepsakes.
            Create yours in minutes — we print, bind, and deliver.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center font-sans">
            <Link
              to="/templates"
              className="bg-terra text-white px-8 py-4 rounded-full font-semibold hover:bg-terra-dark transition text-base tracking-wide"
            >
              Explore Collections
            </Link>
            {!user && (
              <Link
                to="/register"
                className="border-2 border-cream-dark/30 text-cream-dark px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition text-base tracking-wide"
              >
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-warm-white border-b border-warm-border">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 text-sm text-taupe font-sans">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-terra" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              Ultra HD Print
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-terra" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Tear & Spill Safe
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-terra" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Free Shipping
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-terra" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              100% Happiness Guarantee
            </span>
          </div>
        </div>
      </section>

      {/* Album Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-terra text-sm font-medium tracking-[0.15em] uppercase mb-3 font-sans">For Every Occasion</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown">
            Albums Crafted With Love
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.theme}
              to={`/templates?theme=${cat.theme}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream-dark"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brown/80 via-brown/20 to-transparent z-10" />
              <div className="absolute inset-0 bg-taupe/30 group-hover:bg-taupe/10 transition-all duration-500 z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">{cat.title}</h3>
                <p className="text-cream-dark/80 text-xs sm:text-sm font-sans leading-relaxed">{cat.desc}</p>
              </div>
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-sans">Explore</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-warm-white border-y border-warm-border">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-terra text-sm font-medium tracking-[0.15em] uppercase mb-3 font-sans">Simple & Effortless</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown">
              Create Your Album in Minutes
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center group">
                <div className="w-16 h-16 bg-cream-dark text-terra rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-terra group-hover:text-white transition-colors duration-300">
                  {step.icon}
                </div>
                <span className="text-terra font-mono text-sm font-bold">{step.num}</span>
                <h3 className="font-serif text-xl font-bold text-brown mt-1 mb-3">{step.title}</h3>
                <p className="text-taupe text-sm leading-relaxed font-sans max-w-xs mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Quality */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-terra text-sm font-medium tracking-[0.15em] uppercase mb-3 font-sans">Uncompromising Quality</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown">
            Built to Last a Lifetime
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-warm-white rounded-2xl p-6 border border-warm-border hover:border-terra/30 transition group">
              <div className="w-12 h-12 bg-cream-dark text-terra rounded-xl flex items-center justify-center mb-4 group-hover:bg-terra group-hover:text-white transition-colors">
                {f.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-brown mb-2">{f.title}</h3>
              <p className="text-taupe text-sm leading-relaxed font-sans">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brown">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-terra-light text-sm font-medium tracking-[0.15em] uppercase mb-3 font-sans">What Our Customers Say</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Loved by Thousands
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-brown-light/50 backdrop-blur rounded-2xl p-6 border border-brown-light">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-terra-light" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-cream-dark/90 text-sm leading-relaxed mb-4 font-sans italic">"{t.text}"</p>
                <div>
                  <p className="text-white font-semibold text-sm font-sans">{t.name}</p>
                  <p className="text-taupe-light text-xs font-sans">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-terra to-terra-dark" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-20 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Preserve Your Memories?
          </h2>
          <p className="text-white/80 mb-8 text-lg font-sans font-light">
            Start creating your premium photo album today. It only takes a few minutes.
          </p>
          <Link
            to={user ? '/templates' : '/register'}
            className="inline-block bg-white text-terra px-8 py-4 rounded-full font-semibold hover:bg-cream transition text-base tracking-wide font-sans"
          >
            {user ? 'Explore Collections' : 'Create Your Album'}
          </Link>
        </div>
      </section>
    </div>
  );
}
