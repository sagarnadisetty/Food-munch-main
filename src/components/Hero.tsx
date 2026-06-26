/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Search, MapPin, Sparkles, Navigation, ArrowDown } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onScrollToMenu: () => void;
}

export default function Hero({ searchQuery, onSearchChange, onScrollToMenu }: HeroProps) {
  
  const handleFeaturedSearch = (dish: string) => {
    onSearchChange(dish);
    onScrollToMenu();
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-radial from-amber-500/5 via-transparent to-transparent"
    >
      {/* Background Graphic Blobs */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Side Content Column */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 text-xs font-bold rounded-full tracking-wide uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Voted Best Food Delivery Service in Town
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-800 dark:text-white leading-tight"
          >
            Delicious Food <br />
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Delivered
            </span>{' '}
            to Your Doorstep
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans"
          >
            Savor robust culinary crafts made only with certified organic ingredients, packed safely, and hot-boxed directly to your dining table within 30 minutes. Let’s munch!
          </motion.p>

          {/* Integrated Search Food Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-lg mx-auto lg:mx-0"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-2 shadow-xl flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 pl-3 w-full border-b sm:border-b-0 sm:border-r border-slate-150 dark:border-slate-800 pb-2 sm:pb-0">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  id="hero-food-search"
                  type="text"
                  placeholder="What are you craving today?"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-slate-700 dark:text-white text-sm"
                />
              </div>

              <div className="hidden md:flex items-center gap-1.5 pl-2 text-slate-400 w-1/3">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span className="text-xs truncate font-medium">Bengaluru, IN</span>
              </div>

              <button
                id="hero-search-submit"
                onClick={onScrollToMenu}
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-500/10 cursor-pointer transition-all hover:scale-101 flex items-center justify-center gap-2"
              >
                Find Food
              </button>
            </div>

            {/* Quick tag suggestions list */}
            <div className="mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs">
              <span className="text-slate-400 font-medium">Try:</span>
              {['Biryani', 'Pizza', 'Burger', 'Dosa'].map((dish) => (
                <button
                  id={`hero-tag-${dish}`}
                  key={dish}
                  onClick={() => handleFeaturedSearch(dish)}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 rounded-full transition-colors cursor-pointer"
                >
                  {dish}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Navigation/ActionButton Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <button
              id="hero-order-now-btn"
              onClick={onScrollToMenu}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              Order Now
              <Navigation className="w-4 h-4 rotate-45 animate-pulse" />
            </button>
            <button
              id="hero-explore-menu-btn"
              onClick={onScrollToMenu}
              className="px-8 py-3.5 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Explore Menu
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
          </motion.div>
        </div>

        {/* Right Side Visual Banner Graphics Column */}
        <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
          <motion.div
            initial={{ opacity: 0, rotate: 5, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative max-w-[360px] sm:max-w-[420px] w-full"
          >
            {/* Soft backdrop radial border ring */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-full ring-8 ring-amber-100 dark:ring-amber-950/20 blur-xs scale-98 pointer-events-none" />

            {/* Glowing dish image */}
            <div className="relative aspect-square rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80"
                alt="Delicious Gourmet Meals Banner"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 hover:rotate-2"
                referrerPolicy="no-referrer"
              />
              {/* Dynamic Overlay badge */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-6 text-white text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 font-mono">Premium Freshness</p>
                <p className="text-sm font-bold">100% Chef Curated Culinary Trays</p>
              </div>
            </div>

            {/* Float tags/plates */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl shadow-xl flex items-center gap-2 font-sans"
            >
              <div className="w-8 h-8 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-xs">⭐</div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none">Rating</p>
                <p className="text-xs font-black text-slate-800 dark:text-white">4.9/5 TrustScore</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 0.5, ease: 'easeInOut' }}
              className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 font-sans"
            >
              <span className="text-xl">🚀</span>
              <div>
                <p className="text-xs font-extrabold text-slate-800 dark:text-white leading-none">Ultra Fast Delivery</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Hot thermal bags insulation</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
