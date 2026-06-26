/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Heart, Award, Sparkles, Clock, Truck } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  const values = [
    {
      id: 'v1',
      icon: <Award className="w-6 h-6 text-amber-500" />,
      title: 'Premium Quality Ingredients',
      description: 'We strictly source 100% organic, crisp, farm-fresh vegetables and premium Grade-A protein to craft robust flavors.'
    },
    {
      id: 'v2',
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: 'Certified Hygiene Standards',
      description: 'Our kitchen processes are double-sanitized daily and comply with certified international food hygiene requirements.'
    },
    {
      id: 'v3',
      icon: <Truck className="w-6 h-6 text-amber-500" />,
      title: 'Insulated 30-Min Delivery',
      description: 'All deliveries are housed inside custom thermal hot-boxes to preserve freshness and sustain piping hot temperatures.'
    }
  ];

  return (
    <section id="about" className="py-16 bg-slate-50 dark:bg-slate-900/30 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left image collage */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative max-w-sm w-full aspect-[4/5] rounded-[2rem] overflow-hidden group border-4 border-white dark:border-slate-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80"
                alt="Chef Slicing Fresh Produce Kitchen"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Absolute sticker */}
              <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono mb-1">Our Core Value</p>
                <p className="text-sm font-semibold italic">"Crafted with Passion, Served with Integrity"</p>
              </div>
            </div>

            {/* Glowing floating card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="absolute -right-4 top-1/3 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100 dark:border-slate-800"
            >
              <div className="w-9 h-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-bold text-lg">✓</div>
              <div>
                <p className="text-xs font-black text-slate-800 dark:text-white leading-none">100% Certified Clean</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Washed with high precision</p>
              </div>
            </motion.div>
          </div>

          {/* Right Narrative block */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 text-xs font-bold rounded-full tracking-wider mb-2 uppercase">
                <Sparkles className="w-3.5 h-3.5" /> Our Franchise Story
              </div>
              <h2 className="text-2xl sm:text-3.5xl font-black text-slate-800 dark:text-white tracking-tight">
                Crafting Culinary Smiles <br />
                Since <span className="text-amber-500">2018</span>
              </h2>
              <div className="w-12 h-1 bg-amber-500 rounded-full mt-3 mb-2" />
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Food Munch was birthed on a humble food-truck countertop with one singular conviction: that robust, authentic recipes shouldn’t be limited by premium prices or poor, lengthy delivery services. Over the years, we have scaled our operations into high-performance smart kitchens, partnering directly with local farm vendors to feed thousands of residents daily.
            </p>

            {/* Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-full bg-amber-50 dark:bg-amber-955 text-amber-500 flex-shrink-0">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-250">No MSG or Trans-Fats</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">100% trans-fat free baking fats only.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-full bg-amber-50 dark:bg-amber-955 text-amber-500 flex-shrink-0">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-250">Bioplastic Kraft Boxes</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Eco-friendly biodegradable structural cardboard.</p>
                </div>
              </div>
            </div>

            {/* Core Values grid */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 space-y-4">
              {values.map((v) => (
                <div key={v.id} className="flex gap-4 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-150/40 dark:border-slate-800/80 hover:border-amber-400/20 transition-all">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 h-fit">
                    {v.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">{v.title}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-sans">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
