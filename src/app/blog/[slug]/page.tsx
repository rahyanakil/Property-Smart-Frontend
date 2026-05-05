import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, ChevronLeft, Tag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

const POSTS: Record<string, {
  title: string; category: string; author: string; date: string;
  readTime: string; initials: string; color: string; content: string;
}> = {
  'first-time-buyer-guide-2024': {
    title: 'The Complete First-Time Homebuyer Guide for 2024',
    category: 'Buying Guide', author: 'James Mitchell', date: 'Dec 10, 2024',
    readTime: '8 min read', initials: 'JM', color: 'from-blue-500 to-blue-700',
    content: `## Getting Started

Buying your first home is one of the most exciting — and nerve-wracking — decisions of your life. This guide walks you through every step.

## Step 1: Assess Your Finances

Before browsing listings, understand your budget. Calculate your monthly income, existing debts, and savings. Lenders typically want your total debt payments to be under 43% of your gross income.

## Step 2: Get Pre-Approved

A mortgage pre-approval letter tells sellers you're a serious buyer. Gather your pay stubs, bank statements, tax returns, and employment verification. Compare rates from at least three lenders.

## Step 3: Find the Right Neighborhood

Consider commute time, school districts, amenities, and future development. Visit neighborhoods at different times of day. Talk to residents.

## Step 4: Work With a Buyer's Agent

A buyer's agent represents your interests and costs you nothing — their commission is paid by the seller. Choose someone with local expertise and strong reviews.

## Step 5: Make an Offer

Your agent will help you craft a competitive offer based on comparable sales. Include contingencies for home inspection and financing.

## Step 6: Home Inspection

Never skip the home inspection. A licensed inspector will identify issues you might miss. Use the report to negotiate repairs or a price reduction.

## Step 7: Close the Deal

Review all closing documents carefully. Bring a certified check for closing costs (typically 2–5% of the loan amount). Congratulations — you're a homeowner!`,
  },
  'real-estate-market-trends-2025': {
    title: 'Bangladesh Real Estate Market Trends to Watch in 2025',
    category: 'Market Report', author: 'Priya Sharma', date: 'Nov 28, 2024',
    readTime: '6 min read', initials: 'PS', color: 'from-green-500 to-green-700',
    content: `## Bangladesh Property Market Overview 2025

The Bangladesh real estate market continues to evolve rapidly, driven by urbanization, a growing middle class, and expanding infrastructure.

## Key Trends

### 1. Dhaka Apartment Demand Surge
Demand for mid-range apartments in Dhaka's suburban areas (Uttara, Mirpur, Mohammadpur) continues to grow. Prices have increased 12–15% YoY in prime locations.

### 2. Bashundhara & Purbachal Development
The government's Purbachal New Town project is drawing significant investment. Prices per katha have risen 20% since 2023.

### 3. Chittagong Commercial Growth
Chittagong's commercial real estate is booming due to port expansion and special economic zones. Office space demand is at an all-time high.

### 4. Digital Property Platforms
Online property discovery is replacing traditional agents. 65% of buyers now start their search online.

## Price Outlook

Dhaka prime areas (Gulshan, Banani, Baridhara): Appreciation of 8–12% expected in 2025.
Mid-range areas (Uttara, Dhanmondi): 6–10% growth projected.
Chittagong: 10–14% growth driven by industrial expansion.`,
  },
  'how-to-sell-faster': {
    title: '10 Proven Strategies to Sell Your Home Faster',
    category: 'Selling Tips', author: 'Marcus Lee', date: 'Nov 15, 2024',
    readTime: '5 min read', initials: 'ML', color: 'from-orange-500 to-orange-700',
    content: `## Sell Your Property Faster With These Proven Tips

The difference between a property that sits on the market for months and one that sells in weeks often comes down to preparation and pricing.

## 1. Price It Right From Day One

Overpriced properties sit. Competitively priced properties create urgency. Research recent comparable sales in your area and price within 3–5% of market value.

## 2. Professional Photography

Listings with professional photos receive 118% more online views. Invest ৳5,000–15,000 in quality photography — it pays back many times over.

## 3. Declutter and Depersonalize

Buyers need to envision their life in your space. Remove personal photos, excess furniture, and clutter. Clean, neutral spaces photograph better and show better.

## 4. Fix the Small Things

Leaky faucets, peeling paint, broken tiles — small issues signal neglect to buyers. Fix everything before listing.

## 5. Strategic Online Listing

Use all major platforms. Write a compelling description highlighting unique features. Include neighborhood amenities and transport links.

## 6. Flexible Showing Schedule

The more available your property is for viewings, the faster it sells. Accept morning, evening, and weekend appointments.

## 7. Open Houses

Well-promoted open houses create a sense of urgency and competition among buyers.

## 8. Negotiate Strategically

Don't dismiss low offers — counter them. Every negotiation is an opportunity. Work with your agent to understand the buyer's motivation.

## 9. Offer Incentives

Consider including appliances, furniture, or covering some closing costs to sweeten the deal.

## 10. Work With the Right Agent

An experienced agent with local market knowledge is worth their commission. Interview at least three before committing.`,
  },
  'investment-property-101': {
    title: 'Investment Property 101: What You Need to Know Before Buying',
    category: 'Investment', author: 'David Chen', date: 'Nov 5, 2024',
    readTime: '7 min read', initials: 'DC', color: 'from-purple-500 to-purple-700',
    content: `## Introduction to Property Investment in Bangladesh

Real estate investment in Bangladesh offers compelling returns, especially in Dhaka and Chittagong. Here's what you need to know before making your first investment.

## Key Metrics to Understand

### Rental Yield
Gross rental yield = (Annual rent ÷ Property price) × 100

In Dhaka, typical yields range:
- Gulshan/Banani: 4–6%
- Dhanmondi/Uttara: 5–7%
- Mirpur/Mohammadpur: 6–9%

### Capital Appreciation
Dhaka prime areas have historically appreciated 8–15% annually. Factor this into your total return calculation.

### Cash Flow
After mortgage payments, maintenance, and vacancy, does the property generate positive monthly cash flow?

## Due Diligence Checklist

1. Verify all legal documents (title deed, mutation, NOC)
2. Check for any encumbrances or legal disputes
3. Inspect structural condition
4. Assess rental market demand in the area
5. Calculate all-in costs (registration, transfer fees, maintenance)

## Financing Your Investment

Most banks in Bangladesh offer home loans at 9–12% interest. RAJUK and NHB also offer institutional financing. A 30–40% down payment is typically required.

## Tax Considerations

Rental income is taxable. Capital gains on property sales may also be subject to tax. Consult a chartered accountant before purchasing.`,
  },
  'mortgage-rates-explained': {
    title: 'Home Loan Rates in Bangladesh: What Every Buyer Needs to Know',
    category: 'Finance', author: 'Rachel Kim', date: 'Oct 22, 2024',
    readTime: '6 min read', initials: 'RK', color: 'from-teal-500 to-teal-700',
    content: `## Understanding Home Loans in Bangladesh

Navigating home loan options in Bangladesh can be complex. Here's a clear breakdown of what's available and how to choose.

## Types of Home Loans

### Fixed Rate Loans
Your interest rate stays constant for the entire loan term. Best when rates are low and you want payment predictability. Typical rates: 9–11%.

### Variable/Floating Rate Loans
Rates fluctuate based on the Bangladesh Bank policy rate. Can be lower initially but carry more risk. Typical rates: 8–10%.

### Hybrid Loans
Fixed for an initial period (3–5 years), then switches to variable. Offers a balance of stability and flexibility.

## Major Lenders in Bangladesh

- Dutch-Bangla Bank: Competitive rates for salaried professionals
- BRAC Bank: Flexible terms, quick processing
- Prime Bank: Good options for NRBs
- RAJUK Housing Finance: Government-backed, lower rates

## How to Qualify

Lenders typically require:
- Minimum 3 years employment history
- Debt-to-income ratio under 40%
- Clean credit history
- Property legal clearance

## Tips for Getting the Best Rate

1. Maintain a strong credit history
2. Make a larger down payment (40%+)
3. Compare at least 5 lenders
4. Negotiate processing fees
5. Consider the total cost, not just the rate`,
  },
  'home-staging-tips': {
    title: 'Home Staging on a Budget: 15 Tips That Actually Work',
    category: 'Selling Tips', author: 'Sofia Alvarez', date: 'Oct 10, 2024',
    readTime: '4 min read', initials: 'SA', color: 'from-pink-500 to-pink-700',
    content: `## Stage Your Home Without Breaking the Bank

Professional staging can increase your sale price by 5–15%. These budget-friendly tips help you achieve that result without spending a fortune.

## Quick Wins (Under ৳2,000)

1. **Deep clean everything** — Sparkling clean homes feel more valuable
2. **Declutter aggressively** — Remove at least 30% of everything in each room
3. **Fresh paint** — Neutral colors like off-white and light gray appeal to most buyers
4. **Replace dated light fixtures** — New fixtures make kitchens and bathrooms look modern
5. **Add plants** — Greenery makes spaces feel alive and cared-for

## Living Room Staging

- Arrange furniture to create conversation areas
- Remove extra pieces to make the room feel larger
- Add one statement piece (a colorful rug or art print)
- Ensure all lighting works and is warm-toned

## Kitchen Staging

- Clear all countertops (keep only 1–2 items)
- Add fresh flowers or a bowl of seasonal fruit
- Clean or replace cabinet hardware
- Organize the pantry and cabinets — buyers look inside

## Bathroom Staging

- White towels always look luxurious
- Add a small plant or candles
- Remove personal products from counters
- Fix any grout or caulk that looks tired

## Bedroom Staging

- Use hotel-style bedding (white or neutral)
- Clear bedside tables except for one lamp each
- Hide cables and electronics
- Ensure wardrobes are half-empty to show storage space

## Before the Photo Shoot

Walk through every room with fresh eyes. Open curtains for natural light. Remove trash bins from view. Turn on all lights.`,
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  return { title: post?.title || 'Blog Post' };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  const lines = post.content.split('\n');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className={`bg-gradient-to-br ${post.color} py-16 px-4`}>
        <div className="max-w-3xl mx-auto text-white">
          <Link href="/blog" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft size={16} /> Back to Blog
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 bg-white/20 text-xs font-semibold px-3 py-1 rounded-full">
              <Tag size={11} /> {post.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm`}>
              {post.initials}
            </div>
            <div>
              <p className="font-semibold">{post.author}</p>
              <div className="flex items-center gap-3 text-white/70 text-xs">
                <span>{post.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-12 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg max-w-none">
          {lines.map((line, i) => {
            if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">{line.slice(3)}</h2>;
            if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">{line.slice(4)}</h3>;
            if (line.startsWith('- ')) return <li key={i} className="text-gray-700 dark:text-gray-300 ml-4 mb-1">{line.slice(2)}</li>;
            if (line.match(/^\d+\./)) return <li key={i} className="text-gray-700 dark:text-gray-300 ml-4 mb-1">{line.replace(/^\d+\.\s*/, '')}</li>;
            if (line.trim() === '') return <br key={i} />;
            return <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{line}</p>;
          })}
        </div>

        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t dark:border-gray-800 flex items-center justify-between">
          <Link href="/blog" className="btn-secondary flex items-center gap-2">
            <ChevronLeft size={16} /> All Articles
          </Link>
          <Link href="/register" className="btn-primary">Get Started Free</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
