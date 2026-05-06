'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Building, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Youtube, Send } from 'lucide-react';
import { staggerContainer, fadeUp, fadeLeft } from '@/lib/animations';

const socials = [
  { icon: Twitter, label: 'Twitter', href: '#', color: 'hover:bg-sky-500' },
  { icon: Facebook, label: 'Facebook', href: '#', color: 'hover:bg-blue-600' },
  { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:bg-pink-500' },
  { icon: Linkedin, label: 'LinkedIn', href: '#', color: 'hover:bg-blue-700' },
  { icon: Youtube, label: 'YouTube', href: '#', color: 'hover:bg-red-600' },
];

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Browse Properties' },
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/register', label: 'List Your Property' },
];

const propertyTypes = [
  { type: 'HOUSE', label: 'Houses' },
  { type: 'APARTMENT', label: 'Apartments' },
  { type: 'CONDO', label: 'Condos' },
  { type: 'TOWNHOUSE', label: 'Townhouses' },
  { type: 'LAND', label: 'Land & Lots' },
  { type: 'COMMERCIAL', label: 'Commercial' },
];

const supportLinks = [
  { href: '/contact', label: 'Help Center' },
  { href: '/contact', label: 'Contact Support' },
  { href: '/blog', label: 'Market Reports' },
  { href: '/about', label: 'Careers' },
  { href: '/contact', label: 'Privacy Policy' },
  { href: '/contact', label: 'Terms of Service' },
];

function FooterLink({ href, label, dot = 'bg-primary-500' }: { href: string; label: string; dot?: string }) {
  return (
    <motion.li whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
      <Link href={href} className="hover:text-white transition-colors flex items-center gap-1.5 group">
        <span className={`w-1 h-1 rounded-full ${dot} shrink-0 group-hover:scale-150 transition-transform`} />
        {label}
      </Link>
    </motion.li>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const shouldReduce = useReducedMotion();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 mt-auto overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-14">

        {/* Main grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          variants={shouldReduce ? {} : staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Brand column */}
          <motion.div variants={shouldReduce ? {} : fadeLeft} className="lg:col-span-1">
            <motion.div
              className="flex items-center gap-2 text-white font-bold text-xl mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={shouldReduce ? {} : { rotate: [0, -8, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              >
                <Building size={24} className="text-primary-400" />
              </motion.div>
              PropertySmart
            </motion.div>
            <p className="text-sm leading-relaxed mb-5">
              Your trusted real estate marketplace. Find your dream property or list yours with confidence. Serving buyers, sellers, and agents nationwide.
            </p>
            <div className="space-y-2 text-sm mb-6">
              {[
                { icon: Mail, href: 'mailto:hello@propertysmart.com', label: 'hello@propertysmart.com' },
                { icon: Phone, href: 'tel:+15551234567', label: '+1 (555) 123-4567' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Icon size={14} /> {label}
                </motion.a>
              ))}
              <div className="flex items-center gap-2">
                <MapPin size={14} /> 123 Main St, New York, NY 10001
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label, href, color }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-8 h-8 rounded-lg bg-gray-800 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white ${color} transition-colors`}
                  whileHover={shouldReduce ? {} : { scale: 1.2, y: -3 }}
                  whileTap={shouldReduce ? {} : { scale: 0.9 }}
                  initial={shouldReduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.07, type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={shouldReduce ? {} : fadeUp}>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map(({ href, label }) => (
                <FooterLink key={href} href={href} label={label} dot="bg-primary-500" />
              ))}
            </ul>
          </motion.div>

          {/* Property Types */}
          <motion.div variants={shouldReduce ? {} : fadeUp}>
            <h4 className="text-white font-semibold mb-4">Property Types</h4>
            <ul className="space-y-2.5 text-sm">
              {propertyTypes.map(({ type, label }) => (
                <FooterLink key={type} href={`/properties?type=${type}`} label={label} dot="bg-secondary-500" />
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={shouldReduce ? {} : fadeUp}>
            <h4 className="text-white font-semibold mb-4">Support & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              {supportLinks.map(({ href, label }) => (
                <FooterLink key={label} href={href} label={label} dot="bg-gray-600" />
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          className="border-t border-gray-800 dark:border-gray-700 mt-10 pt-8"
          initial={shouldReduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-semibold">Subscribe to our newsletter</p>
              <p className="text-sm text-gray-500 mt-0.5">Get weekly market updates and new listings delivered to your inbox.</p>
            </div>
            <motion.div
              className="flex gap-2 w-full md:w-auto"
              whileFocus={{ scale: 1.01 }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-64 px-4 py-2 rounded-lg bg-gray-800 dark:bg-gray-900 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
              <motion.button
                type="button"
                className="btn-primary whitespace-nowrap flex items-center gap-2"
                whileHover={shouldReduce ? {} : { scale: 1.04, boxShadow: '0 0 20px rgba(37,99,235,0.5)' }}
                whileTap={shouldReduce ? {} : { scale: 0.96 }}
              >
                <Send size={14} /> Subscribe
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm"
          initial={shouldReduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p>© {currentYear} PropertySmart. All rights reserved.</p>
          <div className="flex gap-4">
            {['Privacy', 'Terms', 'Cookies'].map((label) => (
              <motion.div key={label} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                <Link href="/contact" className="hover:text-white transition-colors">{label}</Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
