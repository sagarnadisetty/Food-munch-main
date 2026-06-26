/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck } from 'lucide-react';
import { db } from '../firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface ContactProps {
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function Contact({ addToast }: ContactProps) {
  const [inquirerName, setInquirerName] = useState('');
  const [inquirerEmail, setInquirerEmail] = useState('');
  const [inquiryText, setInquiryText] = useState('');

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquirerName.trim() || !inquirerEmail.trim() || !inquiryText.trim()) {
      addToast('Please fill out all the inquiry fields.', 'error');
      return;
    }

    const messageId = `msg-${Date.now()}`;
    const contactPayload = {
      id: messageId,
      name: inquirerName.trim(),
      email: inquirerEmail.trim(),
      subject: 'Restaurant Inquiry',
      message: inquiryText.trim(),
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'contact_messages', messageId), contactPayload);
      addToast(`Thank you ${inquirerName}! Your message is received. Our manager will reply to ${inquirerEmail} shortly.`, 'success');
      setInquirerName('');
      setInquirerEmail('');
      setInquiryText('');
    } catch (error) {
      console.error("Firestore message writing failed:", error);
      addToast('Could not send message. Please log in first or check internet settings.', 'error');
    }
  };

  return (
    <section id="contact" className="py-16 bg-white dark:bg-slate-900 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 text-xs font-bold rounded-full tracking-wider mb-2 uppercase">
            <MapPin className="w-3.5 h-3.5" /> Locate Cuisine
          </div>
          <h2 className="text-2xl sm:text-3.5xl font-black text-slate-800 dark:text-white">
            Reach Out to Food Munch
          </h2>
          <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full mt-3 mb-2" />
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Join us for dine-in services, request special event catering, or ask queries via our instant email channel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Details block (Col span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/10 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 space-y-6">
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4">Contact Information</h4>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-500/10 dark:bg-amber-500/5 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">Restaurant Address</h5>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    80 Feet Road, Koramangala 4th Block, Bengaluru, Karnataka - 560034
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-500/10 dark:bg-amber-500/5 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">Phone Customer Care</h5>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1 hover:text-amber-500 transition-colors">
                    +91 98765 43210 / 080 4455 6677
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-500/10 dark:bg-amber-500/5 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">Direct Email Services</h5>
                  <a href="mailto:support@foodmunch.com" className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1 block hover:underline">
                    support@foodmunch.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-500/10 dark:bg-amber-500/5 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">Opening Hours (7 Days)</h5>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    Daily: 11:00 AM - 11:30 PM (Last order: 11:15 PM)
                  </p>
                </div>
              </div>
            </div>

            {/* Google maps placeholder (Interactive Graphic with Pinpoint overlay) */}
            <div id="maps-placeholder" className="h-44 rounded-3xl overflow-hidden relative shadow-md border border-slate-100 dark:border-slate-850">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80"
                alt="Map Background Grid"
                className="w-full h-full object-cover opacity-75 grayscale contrast-125 dark:opacity-40"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/30" />
              
              {/* Overlay Pinpoint */}
              <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-[-10px] animate-bounce">
                  📍
                </div>
                <div className="bg-white text-slate-800 dark:bg-slate-950 dark:text-white px-3 py-1.5 rounded-xl shadow-md text-xs font-black tracking-wide border border-slate-100 dark:border-slate-800 mt-1">
                  Food Munch Koramangala
                </div>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form (Col span 7) */}
          <div className="lg:col-span-7 bg-slate-50/40 dark:bg-slate-900/10 p-6 md:p-8 rounded-3xl border border-slate-150 dark:border-slate-800/80">
            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2">Send an Instant Message</h4>
            <p className="text-xs text-slate-400 mb-6">Need bulk party catering? Fill out your parameters here.</p>

            <form id="contact-inquiry-form" onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-405 dark:text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={inquirerName}
                    onChange={(e) => setInquirerName(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-405 dark:text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={inquirerEmail}
                    onChange={(e) => setInquirerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5">Brief Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Ask us anything! From catering rates to specific allergen queries."
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  className="w-full px-4 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[10px] text-slate-400 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Your email is secure and absolutely free from spam.
                </span>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
