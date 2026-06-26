/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, Copy, Check, Sparkles, Tag, ShoppingCart, Percent } from 'lucide-react';
import { COUPONS, SPECIAL_DEALS } from '../data';
import { FoodItem } from '../types';

interface SpecialOffersProps {
  onAddComboToCart: (dish: FoodItem) => void;
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function SpecialOffers({ onAddComboToCart, addToast }: SpecialOffersProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Coupon "${code}" copied to clipboard! Paste it inside your checkout drawer.`, 'success');
    
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const handleAddCombo = (combo: typeof SPECIAL_DEALS[0]) => {
    // Generate a temporary FoodItem representing the combo
    const comboItem: FoodItem = {
      id: combo.id,
      name: combo.title,
      description: combo.description,
      category: 'combo',
      price: combo.dealPrice,
      rating: 4.8,
      reviewsCount: 150,
      image: combo.image,
      isPopular: true,
      isBestSeller: true,
      isVeg: combo.title.toLowerCase().includes('veg')
    };
    onAddComboToCart(comboItem);
    addToast(`${combo.title} added to your cart!`, 'success');
  };

  return (
    <section id="offers" className="py-16 bg-slate-50 dark:bg-slate-900/30 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 text-xs font-bold rounded-full tracking-wider mb-2 uppercase">
            <Gift className="w-3.5 h-3.5" /> Special Treats
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
            Current Deals & Special Offers
          </h2>
          <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full mt-3 mb-2" />
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Supercharge your savings with seasonal discount vouchers, free shipping criteria, and custom bundle packages.
          </p>
        </div>

        {/* 1. Coupons Grid */}
        <div className="mb-14">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono text-center mb-6">Eligible Promo Vouchers</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COUPONS.map((coupon) => (
              <motion.div
                id={`coupon-card-${coupon.code}`}
                key={coupon.code}
                whileHover={{ y: -3 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-dashed border-slate-150 dark:border-slate-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between"
              >
                {/* Decorative background circle */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/5 rounded-full pointer-events-none" />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/10 dark:bg-amber-500/5 text-amber-500 rounded-xl flex items-center justify-center font-bold">
                      <Percent className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-md font-bold text-slate-800 dark:text-white leading-none">
                        {coupon.code === 'FM40' ? '40% Off Order' : `Save ₹${coupon.discount}`}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">Min. order ₹{coupon.minOrder}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    {coupon.description}
                  </p>
                </div>

                {/* Promo Code Copy Row */}
                <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-800/40 flex items-center justify-between gap-3">
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-500 font-mono tracking-wider bg-amber-500/10 dark:bg-amber-500/5 py-1 px-3 rounded-lg border border-amber-500/10">
                    {coupon.code}
                  </span>

                  <button
                    id={`coupon-copy-${coupon.code}`}
                    onClick={() => handleCopyCode(coupon.code)}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-500/10 dark:hover:bg-amber-500/5 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 text-[10px]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 2. Combo Offers Showcase */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono text-center mb-6">Curated Family Combo Packs</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SPECIAL_DEALS.map((deal) => (
              <div
                id={`deal-card-${deal.id}`}
                key={deal.id}
                className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-amber-400/20 hover:shadow-lg transition-all"
              >
                {/* Visual container */}
                <div className="h-48 w-full overflow-hidden relative">
                  <span className="absolute top-4 left-4 bg-amber-500 text-white text-[9px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full z-10 shadow-md">
                    {deal.badge}
                  </span>
                  
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>

                {/* Details layout */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-md sm:text-lg font-black text-slate-800 dark:text-white">
                      {deal.title}
                    </h4>
                    <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed font-sans line-clamp-2">
                      {deal.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-450 line-through">₹{deal.originalPrice}</span>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-1.5 py-0.5 rounded-md">
                          Save ₹{deal.originalPrice - deal.dealPrice}
                        </span>
                      </div>
                      <p className="text-lg font-extrabold text-slate-900 dark:text-amber-400 mt-0.5">₹{deal.dealPrice}</p>
                    </div>

                    <button
                      id={`deal-add-cart-${deal.id}`}
                      onClick={() => handleAddCombo(deal)}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add Combo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free Delivery Promo Strip */}
        <div id="free-delivery-banner" className="mt-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl font-extrabold flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
              Free Doorstep Delivery Activated!
            </h4>
            <p className="text-sm text-amber-50 font-medium max-w-xl">
              Add any delicious meals, drinks, or combos totaling more than <span className="font-extrabold text-white text-md">₹250</span> to automatically discard your shipping fees.
            </p>
          </div>

          <a
            id="strip-order-link"
            href="#menu"
            className="px-6 py-3 bg-white hover:bg-amber-55 hover:text-amber-600 text-amber-600 font-bold text-xs rounded-xl transition-all shadow-md shrink-0 uppercase tracking-wider"
          >
            Start Ordering
          </a>
        </div>

      </div>
    </section>
  );
}
