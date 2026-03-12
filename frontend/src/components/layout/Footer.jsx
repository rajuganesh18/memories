import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brown text-taupe-light mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div className="lg:col-span-1">
            <h3 className="font-serif text-white text-2xl font-bold mb-3 tracking-tight">Memories</h3>
            <p className="text-sm leading-relaxed">
              Handcrafted premium photo albums, printed with care and delivered to your doorstep. Preserve your precious moments forever.
            </p>
          </div>
          <div>
            <h4 className="text-cream font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/templates" className="hover:text-terra-light transition">Collections</Link></li>
              <li><Link to="/templates?theme=wedding" className="hover:text-terra-light transition">Wedding Albums</Link></li>
              <li><Link to="/templates?theme=baby" className="hover:text-terra-light transition">Baby Albums</Link></li>
              <li><Link to="/templates?theme=travel" className="hover:text-terra-light transition">Travel Albums</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-cream font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/dashboard/orders" className="hover:text-terra-light transition">My Orders</Link></li>
              <li><Link to="/dashboard/addresses" className="hover:text-terra-light transition">My Addresses</Link></li>
              <li><Link to="/cart" className="hover:text-terra-light transition">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-cream font-semibold mb-4 text-sm uppercase tracking-wider">Get Started</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/register" className="hover:text-terra-light transition">Create Account</Link></li>
              <li><Link to="/login" className="hover:text-terra-light transition">Sign In</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-brown-light pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Memories. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Free Shipping
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Premium Quality
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
