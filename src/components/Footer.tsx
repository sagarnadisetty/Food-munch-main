/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, ArrowUp, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-400 py-12 border-t border-slate-950">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          
          {/* Column 1: Branding */}
          <div className="space-y-4">
            <a
              id="footer-brand-link"
              href="#home"
              onClick={(e) => handleLinkClick(e, '#home')}
              className="flex items-center gap-2 text-white font-bold text-lg"
            >
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-black text-sm">
                FM
              </div>
              <span>Food <span className="text-amber-500 font-extrabold">Munch</span></span>
            </a>
            
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Award-winning neighborhood kitchen serving certified hygienic recipes directly to your doorsteps under 30 minutes. Let us satisfy your culinary cravings!
            </p>

            {/* Social media icons */}
            <div className="flex gap-2.5 pt-2">
              <a
                id="social-fb"
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8.5 h-8.5 bg-slate-800 hover:bg-amber-500 hover:text-white rounded-lg flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a
                id="social-insta"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8.5 h-8.5 bg-slate-800 hover:bg-amber-500 hover:text-white rounded-lg flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                id="social-twitter"
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8.5 h-8.5 bg-slate-800 hover:bg-amber-500 hover:text-white rounded-lg flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4.5 h-4.5" />
              </a>
              <a
                id="social-linkedin"
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8.5 h-8.5 bg-slate-800 hover:bg-amber-500 hover:text-white rounded-lg flex items-center justify-center text-slate-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-xs">
              {['#home', '#menu', '#offers', '#reviews', '#about'].map((href) => (
                <a
                  key={href}
                  onClick={(e) => handleLinkClick(e, href)}
                  href={href}
                  className="hover:text-amber-500 transition-colors capitalize text-slate-400 font-sans"
                >
                  Explore {href.replace('#', '')}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Contact details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono mb-1">Corporate Care</h4>
            <p className="text-xs font-sans">Koramangala 4th Block, Bengaluru, IN</p>
            <p className="text-xs font-sans font-semibold text-white">Call: +91 98765 43210</p>
            <p className="text-xs font-sans">Email: support@foodmunch.com</p>
          </div>

          {/* Column 4: Back to top / simple newsletter design */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Back to Top</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Finished exploring? Tap below to scroll cleanly to the top menu.
            </p>
            <button
              id="footer-back-to-top"
              onClick={handleScrollTop}
              className="py-2.5 px-4 bg-slate-800 hover:bg-amber-500 hover:text-white text-slate-350 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 w-full shadow-md cursor-pointer"
            >
              <ArrowUp className="w-4 h-4 animate-bounce" />
              Go Back to Top
            </button>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-center gap-4 text-xs">
          <p>© {currentYear} Food Munch Restaurant. All Rights Reserved. Prepared hygienically inside our sterile hubs.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> in Koramangala
          </p>
        </div>

      </div>
    </footer>
  );
}
