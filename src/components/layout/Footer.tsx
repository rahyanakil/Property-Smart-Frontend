import Link from 'next/link';
import { Building, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <Building size={24} className="text-primary-400" />
              PropertySmart
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Your trusted real estate marketplace. Find your dream property or list yours with confidence. Serving buyers, sellers, and agents nationwide.
            </p>
            <div className="space-y-2 text-sm mb-6">
              <a href="mailto:hello@propertysmart.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={14} /> hello@propertysmart.com
              </a>
              <a href="tel:+15551234567" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={14} /> +1 (555) 123-4567
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={14} /> 123 Main St, New York, NY 10001
              </div>
            </div>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: Twitter, label: 'Twitter', href: '#' },
                { icon: Facebook, label: 'Facebook', href: '#' },
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Linkedin, label: 'LinkedIn', href: '#' },
                { icon: Youtube, label: 'YouTube', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-gray-800 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600 transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/properties', label: 'Browse Properties' },
                { href: '/about', label: 'About Us' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/register', label: 'List Your Property' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary-500 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-white font-semibold mb-4">Property Types</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { type: 'HOUSE', label: 'Houses' },
                { type: 'APARTMENT', label: 'Apartments' },
                { type: 'CONDO', label: 'Condos' },
                { type: 'TOWNHOUSE', label: 'Townhouses' },
                { type: 'LAND', label: 'Land & Lots' },
                { type: 'COMMERCIAL', label: 'Commercial' },
              ].map(({ type, label }) => (
                <li key={type}>
                  <Link href={`/properties?type=${type}`} className="hover:text-white transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-secondary-500 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/contact', label: 'Help Center' },
                { href: '/contact', label: 'Contact Support' },
                { href: '/blog', label: 'Market Reports' },
                { href: '/about', label: 'Careers' },
                { href: '/contact', label: 'Privacy Policy' },
                { href: '/contact', label: 'Terms of Service' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-gray-600 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 dark:border-gray-700 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-semibold">Subscribe to our newsletter</p>
              <p className="text-sm text-gray-500 mt-0.5">Get weekly market updates and new listings delivered to your inbox.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-64 px-4 py-2 rounded-lg bg-gray-800 dark:bg-gray-900 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <p>© {currentYear} PropertySmart. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
