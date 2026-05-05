'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setErrors({});
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-600 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">Get in Touch</h1>
          <p className="text-primary-100 text-lg">Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Contact Information</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Reach out through any channel and we&apos;ll get back to you within 24 hours.</p>
              </div>

              {[
                { icon: Phone, label: 'Phone', value: '+880 961-123-4567', href: 'tel:+8809611234567' },
                { icon: Mail, label: 'Email', value: 'hello@propertysmart.com.bd', href: 'mailto:hello@propertysmart.com.bd' },
                { icon: MapPin, label: 'Office', value: 'House 12, Road 5, Gulshan-1, Dhaka 1212', href: '#' },
                { icon: Clock, label: 'Hours', value: 'Sun–Thu: 9am–6pm BST', href: '#' },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className="card p-5 flex gap-4 hover:shadow-md transition-shadow block">
                  <div className="w-11 h-11 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{value}</p>
                  </div>
                </a>
              ))}

              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Quick links</h3>
                <div className="space-y-2">
                  {[
                    { label: 'List your property', href: '/register' },
                    { label: 'Find an agent', href: '/properties' },
                    { label: 'Browse listings', href: '/properties' },
                    { label: 'Read our blog', href: '/blog' },
                  ].map(({ label, href }) => (
                    <a key={label} href={href} className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      <span className="w-1 h-1 rounded-full bg-primary-500" />{label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="card p-12 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Thanks for reaching out. We&apos;ll reply to <strong>{form.email}</strong> within 24 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn-primary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="card p-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="input" placeholder="John Smith" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="input" placeholder="you@example.com" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
                      <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input">
                        <option value="">Select a topic...</option>
                        {['General Inquiry', 'List My Property', 'Agent Partnership', 'Technical Support', 'Billing', 'Other'].map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                      <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={5} className="input resize-none" placeholder="Tell us how we can help you..." />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">{form.message.length}/500</p>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
