/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Sparkles, Pizza, Beef, Utensils, Soup, Cake, Coffee, Flame } from 'lucide-react';
import { CATEGORIES } from '../data';

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onScrollToMenu: () => void;
}

// Safely maps string identifier to Lucide component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles': return <Sparkles className="w-6 h-6" />;
    case 'Pizza': return <Pizza className="w-6 h-6" />;
    case 'Beef': return <Beef className="w-6 h-6" />;
    case 'Utensils': return <Utensils className="w-6 h-6" />;
    case 'Soup': return <Soup className="w-6 h-6" />;
    case 'Cake': return <Cake className="w-6 h-6" />;
    case 'Coffee': return <Coffee className="w-6 h-6" />;
    default: return <Flame className="w-6 h-6" />;
  }
};

export default function Categories({
  selectedCategory,
  onSelectCategory,
  onScrollToMenu
}: CategoriesProps) {
  
  const handleCategoryClick = (id: string) => {
    onSelectCategory(id);
    onScrollToMenu();
  };

  return (
    <section id="categories" className="py-12 bg-slate-50/40 dark:bg-slate-900/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Explore <span className="text-amber-500">Popular Categories</span>
          </h2>
          <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full mt-3 mb-2" />
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Satisfy your hunger by filtering your cravings into quick handpicked recipes.
          </p>
        </div>

        {/* Categories Grid list */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 justify-center">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <motion.button
                id={`category-btn-${category.id}`}
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/15'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-150 dark:border-slate-800/80 hover:bg-amber-100/10 hover:border-amber-400/30'
                }`}
              >
                <div className={`p-2.5 rounded-xl flex items-center justify-center ${
                  isActive ? 'bg-white/15 text-white' : 'bg-amber-500/10 dark:bg-amber-500/5 text-amber-500'
                }`}>
                  {getIconComponent(category.iconName)}
                </div>
                <span className="text-xs font-bold font-sans truncate w-full tracking-wide">
                  {category.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
