import Link from 'next/link';
import {
  Search, Home, Building, TrendingUp, Star, ChevronRight, MapPin,
  Shield, Clock, Award, Users, CheckCircle, ChevronDown,
  FileSearch, Key, Handshake, MessageSquare, Phone, Mail,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FeaturedProperties from '@/components/property/FeaturedProperties';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'First-time Homebuyer',
    avatar: 'SJ',
    rating: 5,
    text: 'PropertySmart made finding my first home an absolute breeze. The filters are powerful and the agents are incredibly responsive. I found my dream home in just 2 weeks!',
  },
  {
    name: 'Michael Chen',
    role: 'Real Estate Investor',
    avatar: 'MC',
    rating: 5,
    text: 'As someone who manages a portfolio of properties, this platform has streamlined my entire process. The analytics and market insights are truly invaluable.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Agent, 5 years',
    avatar: 'ER',
    rating: 5,
    text: 'The agent dashboard is everything I needed. I can manage all my listings, bookings, and client communications from one place. My business has grown 40% since joining.',
  },
];

const faqs = [
  {
    q: 'How do I list my property on PropertySmart?',
    a: 'Register as an Agent, complete your profile, then use the "Add Property" button in your dashboard. You can add photos, details, pricing, and your property goes live immediately after review.',
  },
  {
    q: 'Are the listings verified?',
    a: 'Yes. All properties go through our verification process. Our team reviews each listing for accuracy, and agents must complete identity verification before listing properties.',
  },
  {
    q: 'How does the booking/viewing process work?',
    a: 'As a buyer, click "Book Viewing" on any property page. Select your preferred date and time. The agent will confirm within 24 hours. You\'ll receive email notifications for all updates.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept all major credit cards, debit cards, and bank transfers through our secure Stripe payment system. All transactions are encrypted and PCI-compliant.',
  },
  {
    q: 'Can I save properties to view later?',
    a: 'Absolutely. Click the heart icon on any property to add it to your Favorites. Access all your saved properties from your buyer dashboard anytime.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ───── 1. Hero ───── */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white" style={{ minHeight: '65vh' }}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center flex flex-col items-center justify-center" style={{ minHeight: '65vh' }}>
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            10,000+ Properties Listed Nationwide
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Find Your Dream
            <span className="block text-yellow-400">Property Today</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Browse thousands of listings — houses, apartments, condos, and commercial spaces. Your perfect property is just a search away.
          </p>

          {/* Search bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 max-w-2xl w-full mx-auto flex gap-2 shadow-2xl">
            <div className="flex items-center flex-1 gap-2 px-3">
              <Search className="text-gray-400 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search by city, neighborhood, or address..."
                className="flex-1 text-gray-800 dark:text-gray-200 dark:bg-gray-800 outline-none text-sm"
              />
            </div>
            <Link href="/properties" className="btn-primary rounded-xl whitespace-nowrap">
              Search
            </Link>
          </div>

          {/* Quick filters */}
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            {['For Sale', 'For Rent', 'New Listings', 'Featured'].map((f) => (
              <Link key={f} href="/properties" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs px-3 py-1.5 rounded-full transition-colors">
                {f}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
            {[
              { label: 'Properties', value: '10,000+' },
              { label: 'Happy Clients', value: '5,000+' },
              { label: 'Expert Agents', value: '200+' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-yellow-400">{stat.value}</div>
                <div className="text-sm text-blue-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 2. Browse by Type ───── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse by Type</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-10">Find the property that fits your lifestyle</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { type: 'HOUSE', label: 'Houses', icon: Home, count: '3,200+' },
              { type: 'APARTMENT', label: 'Apartments', icon: Building, count: '2,800+' },
              { type: 'CONDO', label: 'Condos', icon: Building, count: '1,500+' },
              { type: 'TOWNHOUSE', label: 'Townhouses', icon: Home, count: '900+' },
              { type: 'LAND', label: 'Land', icon: MapPin, count: '600+' },
              { type: 'COMMERCIAL', label: 'Commercial', icon: TrendingUp, count: '400+' },
            ].map(({ type, label, icon: Icon, count }) => (
              <Link
                key={type}
                href={`/properties?type=${type}`}
                className="card p-5 text-center hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                  <Icon size={24} className="text-primary-600 dark:text-primary-400" />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 block">{label}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 block">{count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 3. Featured Properties ───── */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Properties</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Hand-picked listings from our top agents</p>
            </div>
            <Link href="/properties?isFeatured=true" className="btn-secondary flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <FeaturedProperties />
        </div>
      </section>

      {/* ───── 4. How It Works ───── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">How It Works</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-12">Find your perfect home in 3 simple steps</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-200 to-primary-400 dark:from-primary-800 dark:to-primary-600" />
            {[
              {
                step: '01',
                icon: FileSearch,
                title: 'Search & Filter',
                desc: 'Use our advanced search and filtering tools to find properties that match your exact criteria — location, price, type, and more.',
              },
              {
                step: '02',
                icon: Key,
                title: 'Book a Viewing',
                desc: 'Schedule a property viewing directly through the platform. Choose your preferred date and time. Our agents confirm within 24 hours.',
              },
              {
                step: '03',
                icon: Handshake,
                title: 'Close the Deal',
                desc: 'Work with our verified agents to finalize the purchase or rental agreement. Secure payments processed safely through Stripe.',
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="card p-8 text-center hover:shadow-md transition-shadow">
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto">
                    <Icon size={30} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 dark:bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 5. Why PropertySmart ───── */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose PropertySmart?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">We combine cutting-edge technology with deep real estate expertise to deliver an unmatched property search experience.</p>
              <div className="space-y-4">
                {[
                  { icon: Shield, title: 'Verified Listings Only', desc: 'Every listing is manually reviewed by our team for accuracy and legitimacy.' },
                  { icon: Clock, title: '24/7 Support', desc: 'Our dedicated support team is available round the clock to assist you.' },
                  { icon: TrendingUp, title: 'Real-time Market Data', desc: 'Access live pricing trends, neighborhood statistics, and investment insights.' },
                  { icon: Award, title: 'Award-Winning Service', desc: 'Recognized as the #1 real estate platform for 3 consecutive years.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '10K+', label: 'Active Listings', color: 'bg-primary-600' },
                { value: '5K+', label: 'Happy Clients', color: 'bg-secondary-600' },
                { value: '200+', label: 'Expert Agents', color: 'bg-yellow-500' },
                { value: '98%', label: 'Satisfaction Rate', color: 'bg-purple-600' },
              ].map(({ value, label, color }) => (
                <div key={label} className="card p-6 text-center hover:shadow-md transition-shadow">
                  <div className={`text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br ${color === 'bg-primary-600' ? 'from-primary-500 to-primary-700' : color === 'bg-secondary-600' ? 'from-secondary-500 to-secondary-700' : color === 'bg-yellow-500' ? 'from-yellow-400 to-yellow-600' : 'from-purple-500 to-purple-700'}`}>
                    {value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── 6. Testimonials ───── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-2">What Our Clients Say</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">Thousands of happy clients trust PropertySmart</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1 mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 7. Stats Banner ───── */}
      <section className="py-12 px-4 bg-primary-600 dark:bg-primary-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Building, value: '10,000+', label: 'Properties Listed' },
              { icon: Users, value: '5,000+', label: 'Registered Buyers' },
              { icon: CheckCircle, value: '3,500+', label: 'Deals Closed' },
              { icon: Star, value: '4.9/5', label: 'Average Rating' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                  <Icon size={22} />
                </div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-primary-100 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 8. FAQ ───── */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">Everything you need to know about PropertySmart</p>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details key={idx} className="card overflow-hidden group">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  {faq.q}
                  <ChevronDown size={18} className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-3" />
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t dark:border-gray-700 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 9. Contact CTA ───── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Find Your Home?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Join thousands of happy homeowners who found their dream property through PropertySmart. Our experts are ready to help you every step of the way.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/register" className="btn-primary flex items-center gap-2">
                  Get Started Free <ChevronRight size={16} />
                </Link>
                <Link href="/contact" className="btn-secondary flex items-center gap-2">
                  <MessageSquare size={16} /> Contact an Agent
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="tel:+15551234567" className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                  <Phone size={22} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Call us</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">+1 (555) 123-4567</p>
                </div>
              </a>
              <a href="mailto:hello@propertysmart.com" className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-secondary-50 dark:bg-secondary-900/20 rounded-xl flex items-center justify-center group-hover:bg-secondary-100 dark:group-hover:bg-secondary-900/30 transition-colors">
                  <Mail size={22} className="text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email us</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">hello@propertysmart.com</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
