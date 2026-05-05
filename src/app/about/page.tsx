import Link from 'next/link';
import { Building, Users, Award, Target, Heart, TrendingUp, Shield, Clock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About Us' };

const team = [
  { name: 'James Mitchell', role: 'CEO & Co-Founder', initials: 'JM', bio: '15+ years in real estate technology. Former VP at a top US brokerage.' },
  { name: 'Priya Sharma', role: 'CTO', initials: 'PS', bio: 'Led engineering at two PropTech startups. Stanford CS graduate.' },
  { name: 'Marcus Lee', role: 'Head of Sales', initials: 'ML', bio: 'Closed $500M+ in real estate deals. Expert in luxury residential markets.' },
  { name: 'Sofia Alvarez', role: 'Head of Design', initials: 'SA', bio: 'Designed award-winning property apps used by 2M+ users globally.' },
  { name: 'David Chen', role: 'Head of Agents', initials: 'DC', bio: 'Built and managed a network of 200+ top-rated real estate agents.' },
  { name: 'Rachel Kim', role: 'Marketing Director', initials: 'RK', bio: 'Grew PropertySmart\'s user base from 0 to 50K in 18 months.' },
];

const values = [
  { icon: Shield, title: 'Trust & Transparency', desc: 'Every listing is verified. Every agent is screened. No hidden fees, ever.' },
  { icon: Heart, title: 'Client First', desc: 'We measure our success by how well our clients succeed. Your goals are our goals.' },
  { icon: TrendingUp, title: 'Innovation', desc: 'We continuously build better tools — smarter search, richer analytics, faster bookings.' },
  { icon: Users, title: 'Community', desc: 'PropertySmart is more than a marketplace. We\'re building a community of informed buyers, sellers, and agents.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <Building size={16} /> Our Story
          </div>
          <h1 className="text-5xl font-extrabold mb-6">We&apos;re Changing How People Find Homes</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            PropertySmart was founded in 2020 with a single mission: make real estate accessible, transparent, and stress-free for everyone.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm mb-3">
                <Target size={16} /> OUR MISSION
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Making Real Estate Accessible to Everyone
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We believe finding a home should be an exciting journey, not an overwhelming ordeal. PropertySmart combines powerful technology with deep market expertise to give every buyer, renter, and investor the insights they need.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                From first-time buyers navigating the market to seasoned investors managing portfolios, our platform adapts to meet every real estate need — with verified listings, intelligent search, and a network of trusted agents.
              </p>
              <div className="flex gap-4 mt-8">
                <Link href="/register" className="btn-primary">Get Started</Link>
                <Link href="/contact" className="btn-secondary">Talk to Us</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Building, value: '10,000+', label: 'Active Listings' },
                { icon: Users, value: '5,000+', label: 'Happy Clients' },
                { icon: Award, value: '200+', label: 'Verified Agents' },
                { icon: TrendingUp, value: '$2B+', label: 'Property Value Listed' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="card p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon size={20} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Values</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">The principles that guide everything we do</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-2">Meet the Team</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">The people building the future of real estate</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="card p-6 flex gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {member.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Journey</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">From a startup idea to a nationwide platform</p>
          <div className="space-y-6">
            {[
              { year: '2020', title: 'Founded', desc: 'PropertySmart launched with 50 listings and a team of 4 in New York.' },
              { year: '2021', title: 'First 1,000 Users', desc: 'Grew to 1,000+ registered buyers and onboarded 25 verified agents.' },
              { year: '2022', title: 'Series A Funding', desc: 'Raised $5M to expand to 10 major US cities and build our AI search engine.' },
              { year: '2023', title: 'National Expansion', desc: 'Reached 50 states with 5,000+ listings and launched our agent dashboard.' },
              { year: '2024', title: '10,000 Listings', desc: 'Crossed 10,000 active listings and $2B in property value on the platform.' },
            ].map(({ year, title, desc }) => (
              <div key={year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {year.slice(2)}
                  </div>
                  <div className="w-0.5 bg-gray-200 dark:bg-gray-700 flex-1 mt-2" />
                </div>
                <div className="card p-4 flex-1 mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{year}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary-600 dark:bg-primary-800 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <Clock size={40} className="mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Join the PropertySmart Community</h2>
          <p className="text-primary-100 mb-8">Whether you&apos;re buying, selling, or just exploring — we&apos;re here to help.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold px-6 py-3 rounded-lg transition-colors">
              Create Account
            </Link>
            <Link href="/properties" className="border border-white text-white hover:bg-primary-700 font-semibold px-6 py-3 rounded-lg transition-colors">
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
