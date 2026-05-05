import Link from 'next/link';
import { Clock, User, Tag, ChevronRight, BookOpen } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Blog' };

const posts = [
  {
    slug: 'first-time-buyer-guide-2024',
    category: 'Buying Guide',
    title: 'The Complete First-Time Homebuyer Guide for 2024',
    excerpt: 'Everything you need to know about buying your first home — from getting pre-approved to closing day. A step-by-step roadmap built for first-timers.',
    author: 'James Mitchell',
    date: 'Dec 10, 2024',
    readTime: '8 min read',
    featured: true,
    color: 'from-blue-500 to-blue-700',
    initials: 'JM',
  },
  {
    slug: 'real-estate-market-trends-2025',
    category: 'Market Report',
    title: 'US Real Estate Market Trends to Watch in 2025',
    excerpt: 'Mortgage rates, inventory levels, buyer demand — our analysts break down the key trends shaping the housing market in 2025.',
    author: 'Priya Sharma',
    date: 'Nov 28, 2024',
    readTime: '6 min read',
    featured: true,
    color: 'from-green-500 to-green-700',
    initials: 'PS',
  },
  {
    slug: 'how-to-sell-faster',
    category: 'Selling Tips',
    title: '10 Proven Strategies to Sell Your Home Faster',
    excerpt: 'From staging to pricing strategy, these 10 data-backed tactics help sellers attract more offers and close deals in record time.',
    author: 'Marcus Lee',
    date: 'Nov 15, 2024',
    readTime: '5 min read',
    featured: false,
    color: 'from-orange-500 to-orange-700',
    initials: 'ML',
  },
  {
    slug: 'investment-property-101',
    category: 'Investment',
    title: 'Investment Property 101: What You Need to Know Before Buying',
    excerpt: 'Cap rates, cash flow, location analysis — learn the fundamentals of real estate investing before making your first investment purchase.',
    author: 'David Chen',
    date: 'Nov 5, 2024',
    readTime: '7 min read',
    featured: false,
    color: 'from-purple-500 to-purple-700',
    initials: 'DC',
  },
  {
    slug: 'mortgage-rates-explained',
    category: 'Finance',
    title: 'Mortgage Rates Explained: Fixed vs. Adjustable in 2024',
    excerpt: 'Understanding the difference between fixed and adjustable-rate mortgages can save you thousands. Here\'s what every buyer needs to know.',
    author: 'Rachel Kim',
    date: 'Oct 22, 2024',
    readTime: '6 min read',
    featured: false,
    color: 'from-teal-500 to-teal-700',
    initials: 'RK',
  },
  {
    slug: 'home-staging-tips',
    category: 'Selling Tips',
    title: 'Home Staging on a Budget: 15 Tips That Actually Work',
    excerpt: 'Professional staging can increase your sale price by 5-15%. These budget-friendly tips help you stage effectively without breaking the bank.',
    author: 'Sofia Alvarez',
    date: 'Oct 10, 2024',
    readTime: '4 min read',
    featured: false,
    color: 'from-pink-500 to-pink-700',
    initials: 'SA',
  },
];

const categories = ['All', 'Buying Guide', 'Selling Tips', 'Market Report', 'Investment', 'Finance'];

export default function BlogPage() {
  const featured = posts.filter((p) => p.featured);
  const regular = posts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-4">
            <BookOpen size={14} /> PropertySmart Blog
          </div>
          <h1 className="text-4xl font-extrabold mb-4">Real Estate Insights & Market News</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Expert guides, market analysis, and practical advice for buyers, sellers, and investors.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900 flex-1">
        <div className="max-w-6xl mx-auto">

          {/* Category filters */}
          <div className="flex gap-2 flex-wrap mb-10">
            {categories.map((cat) => (
              <button key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  cat === 'All'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Featured posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {featured.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="card overflow-hidden hover:shadow-lg transition-shadow group">
                <div className={`h-48 bg-gradient-to-br ${post.color} flex items-center justify-center`}>
                  <div className="text-white text-center px-6">
                    <span className="inline-block bg-white/20 text-xs font-semibold px-3 py-1 rounded-full mb-3">{post.category}</span>
                    <p className="font-bold text-lg leading-snug">{post.title}</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${post.color} flex items-center justify-center text-white text-xs font-bold`}>{post.initials}</div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* All posts grid */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {regular.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="card overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
                <div className={`h-28 bg-gradient-to-br ${post.color} flex items-end p-3`}>
                  <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    <Tag size={10} /> {post.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${post.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{post.initials}</div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{post.author}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                        <span>{post.date}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5"><Clock size={10} />{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div className="card p-8 text-center bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-100 dark:border-primary-800">
            <User size={36} className="mx-auto mb-3 text-primary-500" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Stay in the Loop</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-md mx-auto">
              Get our weekly market report, investment tips, and new listings digest delivered every Monday.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input type="email" placeholder="your@email.com" className="input flex-1" />
              <button type="button" className="btn-primary whitespace-nowrap flex items-center gap-1">
                Subscribe <ChevronRight size={14} />
              </button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Join 12,000+ subscribers. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
