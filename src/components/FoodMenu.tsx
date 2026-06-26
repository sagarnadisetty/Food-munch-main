/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Heart, Flame, ShoppingCart, RefreshCcw, SlidersHorizontal, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { FoodItem, CartItem } from '../types';
import { FOOD_ITEMS } from '../data';

interface FoodMenuProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cart: CartItem[];
  onAddToCart: (item: FoodItem) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  isFavoritesOnly?: boolean;
}

export default function FoodMenu({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cart,
  onAddToCart,
  favorites,
  onToggleFavorite,
  isFavoritesOnly = false
}: FoodMenuProps) {
  
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'priceLowHigh' | 'priceHighLow' | 'rating'>('default');

  // Helper check if item is in cart
  const getItemQuantity = (itemId: string): number => {
    const found = cart.find((c) => c.item.id === itemId);
    return found ? found.quantity : 0;
  };

  // Perform filtering & sorting on data source
  const filteredItems = useMemo(() => {
    return FOOD_ITEMS.filter((item) => {
      // Category filter check
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      // Search filter check
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      
      // Vegetable toggle check
      const matchesVeg = !showVegOnly || item.isVeg;

      // Favorites filter check
      const matchesFavorite = !isFavoritesOnly || favorites.includes(item.id);

      return matchesCategory && matchesSearch && matchesVeg && matchesFavorite;
    }).sort((a, b) => {
      if (sortBy === 'priceLowHigh') return a.price - b.price;
      if (sortBy === 'priceHighLow') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default (no sorting)
    });
  }, [selectedCategory, searchQuery, showVegOnly, sortBy]);

  // Extract Top Trending isPopular dishes separately for the popular food carousel
  const popularDishes = useMemo(() => {
    return FOOD_ITEMS.filter((item) => item.isPopular);
  }, []);

  const handleResetFilters = () => {
    onSelectCategory('all');
    onSearchChange('');
    setShowVegOnly(false);
    setSortBy('default');
  };

  return (
    <section id="menu" className="py-16 bg-white dark:bg-slate-900 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* ================= TRENDING / POPULAR DISHES PANEL ================= */}
        <div id="popular-recipes" className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest font-mono">
                <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
                Highly Recommended
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mt-1">
                Trending Best Sellers
              </h3>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm">
              Our absolute crowd-pleasing meals with thousand-plus ratings. Quick-check checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDishes.slice(0, 3).map((dish) => {
              const qty = getItemQuantity(dish.id);
              const isFav = favorites.includes(dish.id);
              return (
                <div
                  id={`trending-card-${dish.id}`}
                  key={`popular-${dish.id}`}
                  className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 dark:from-slate-800/20 dark:to-slate-800/10 rounded-3xl p-5 border border-amber-500/10 dark:border-slate-800 flex flex-col justify-between group overflow-hidden relative"
                >
                  {/* Absolute Badge */}
                  <div className="absolute top-4 left-4 bg-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md z-10 font-mono">
                    Best Seller 🔥
                  </div>

                  {/* Absolute favorite pin */}
                  <button
                    id={`popular-fav-btn-${dish.id}`}
                    onClick={() => onToggleFavorite(dish.id)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md flex items-center justify-center text-slate-400 hover:text-pink-600 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-pink-600 text-pink-600' : ''}`} />
                  </button>

                  <div className="space-y-4">
                    {/* Visual box */}
                    <div className="aspect-video w-full rounded-2xl overflow-hidden relative shadow-md">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Details content row */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1 bg-amber-500/10 dark:bg-amber-500/5 px-2.5 py-0.5 rounded-full w-fit">
                        <span className={`w-2 h-2 border flex-shrink-0 relative ${
                          dish.isVeg ? 'border-emerald-600' : 'border-red-600'
                        }`}>
                          <span className={`absolute inset-[0.5px] rounded-full ${
                            dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                          }`} />
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 capitalize">{dish.category}</span>
                      </div>
                      
                      <h4 className="text-md sm:text-lg font-bold text-slate-800 dark:text-white group-hover:text-amber-500 transition-colors">
                        {dish.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  {/* Price checkout footer */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <div>
                      <p className="text-xs text-slate-400 leading-none">Best Deal</p>
                      <p className="text-lg font-black text-slate-800 dark:text-amber-400 mt-1">₹{dish.price}</p>
                    </div>
                    
                    <button
                      id={`popular-add-cart-${dish.id}`}
                      onClick={() => onAddToCart(dish)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-amber-500 dark:hover:bg-amber-600 text-white text-xs font-black rounded-xl transition-all shadow-md transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      {qty > 0 ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                          Added ({qty})
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= MAIN FOOD MENU SECTION ================= */}
        <div id="explore-menu-grid" className="border-t border-slate-100 dark:border-slate-800 pt-16">
          
          {/* Menu Title */}
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Our Delicacies Menu
            </h3>
            <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full mt-3 mb-2" />
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
              Sift through our authentic categories to customize your ideal dinner plate.
            </p>
          </div>

          {/* Filtering Widgets and Controls Container Row */}
          <div className="bg-slate-50 dark:bg-slate-800/20 p-4 rounded-2xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-150/50 dark:border-slate-800">
            {/* Left veg filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="veg-filter-toggle"
                onClick={() => setShowVegOnly(!showVegOnly)}
                className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors focus:outline-none cursor-pointer"
              >
                <span className="text-slate-400 uppercase tracking-widest font-mono text-[10px]">Veg-Only</span>
                {showVegOnly ? (
                  <ToggleRight className="w-8 h-8 text-emerald-500 fill-emerald-100" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>

              {/* Status active summary indicators */}
              {(selectedCategory !== 'all' || searchQuery || showVegOnly) && (
                <button
                  id="reset-filters-btn"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg border border-rose-100 dark:border-rose-900/30 transition-colors"
                >
                  <RefreshCcw className="w-3 h-3" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Right sorting selectors */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono hidden sm:inline">Sort By</span>
              <select
                id="menu-sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="default">Default Relevance</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="rating">Top Rated ⭐</option>
              </select>
            </div>
          </div>

          {/* Active stats */}
          <div className="mb-4 text-xs text-slate-400 font-medium">
            Showing <span className="font-extrabold text-slate-700 dark:text-slate-300">{filteredItems.length}</span> delicacies
            {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>

          {/* Menu items Grid container with fade-in and transition list */}
          <AnimatePresence mode="popLayout">
            {filteredItems.length === 0 ? (
              /* No items fallback screen */
              <motion.div
                id="no-dishes-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center bg-slate-50/20 dark:bg-slate-900/10 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center"
              >
                <SlidersHorizontal className="w-12 h-12 text-slate-300 mb-3" />
                <h4 className="text-md font-bold text-slate-700 dark:text-slate-300">No dishes match your preferences</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
                  Try clearing the search query or changing your category to discover more Food Munch platters.
                </p>
                <button
                  id="reset-fallback-btn"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow"
                >
                  Reset Active Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                id="dishes-grid"
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {filteredItems.map((dish) => {
                  const qty = getItemQuantity(dish.id);
                  const isFav = favorites.includes(dish.id);
                  return (
                    <motion.div
                      id={`dish-card-${dish.id}`}
                      key={dish.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:border-amber-400/20 dark:hover:border-amber-400/10 hover:translate-y-[-4px] transition-all relative"
                    >
                      {/* Favorite button absolute */}
                      <button
                        id={`menu-fav-btn-${dish.id}`}
                        onClick={() => onToggleFavorite(dish.id)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 dark:bg-slate-950/95 shadow-md flex items-center justify-center text-slate-400 hover:text-pink-600 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                      >
                        <Heart className={`w-4 h-4 transition-colors ${isFav ? 'fill-pink-600 text-pink-600' : ''}`} />
                      </button>

                      {/* Top seller tag absolute */}
                      {dish.isBestSeller && (
                        <span className="absolute top-3 left-3 z-10 bg-amber-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md font-mono">
                          Best Seller
                        </span>
                      )}

                      {/* Card visual container */}
                      <div className="aspect-video w-full overflow-hidden relative bg-slate-100">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Card Details Body */}
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          {/* Category and Veg indicator details */}
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className={`w-2.5 h-2.5 border flex-shrink-0 relative ${
                              dish.isVeg ? 'border-emerald-600' : 'border-red-600'
                            }`} title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}>
                              <span className={`absolute inset-[1.5px] rounded-full ${
                                dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                              }`} />
                            </span>
                            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{dish.category}</span>
                          </div>

                          <h4 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-1">
                            {dish.name}
                          </h4>
                          
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-3 line-clamp-2 leading-relaxed">
                            {dish.description}
                          </p>
                        </div>

                        {/* Ratings & reviews row info */}
                        <div className="pt-2 border-t border-slate-50 dark:border-slate-800/40 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">{dish.rating}</span>
                            <span className="text-slate-400">({dish.reviewsCount >= 1000 ? `${(dish.reviewsCount/1000).toFixed(1)}k` : dish.reviewsCount})</span>
                          </div>

                          <p className="text-sm font-black text-slate-900 dark:text-white">₹{dish.price}</p>
                        </div>
                      </div>

                      {/* Add checkout action bar */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        {qty > 0 ? (
                          <div className="w-full flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500">In Cart: <strong className="text-slate-800 dark:text-white">{qty}</strong></span>
                            <button
                              id={`menu-added-btn-${dish.id}`}
                              onClick={() => onAddToCart(dish)}
                              className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              Add More
                            </button>
                          </div>
                        ) : (
                          <button
                            id={`menu-add-cart-${dish.id}`}
                            onClick={() => onAddToCart(dish)}
                            className="w-full py-2 bg-amber-500 hover:bg-amber-600 active:scale-98 transition-all text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 font-bold" />
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
