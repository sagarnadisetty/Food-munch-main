/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search, Moon, Sun, Heart, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  currentUser: any;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({
  cart,
  onOpenCart,
  searchQuery,
  onSearchChange,
  favoritesCount,
  onOpenFavorites,
  currentUser,
  onLogin,
  onLogout
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Softly toggles HTML theme dark class
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const cartItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'Offers', href: '#offers' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${
        isScrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md py-3 border-b border-slate-150/40 dark:border-slate-800/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          id="brand-link"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#home');
          }}
          className="flex items-center gap-2 group focus:outline-none"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-amber-500/20 group-hover:rotate-6 transition-transform">
            FM
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-amber-600 dark:from-white dark:to-amber-500 bg-clip-text text-transparent">
            Food <span className="text-amber-500 dark:text-amber-400 font-extrabold">Munch</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors tracking-wide"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Interactive Controls Panel */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Quick Realtime search bar container */}
          <div className="relative">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 180, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="absolute right-8 top-1/2 -translate-y-1/2 overflow-hidden z-10 hidden sm:block"
                >
                  <input
                    id="search-input-header"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search dishes..."
                    className="w-full px-3 py-1 text-xs text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 border-none rounded-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              id="header-search-toggle"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-400 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              title="Search dishes"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Dark / Light toggle switcher */}
          <button
            id="theme-toggle-btn"
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-400 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Favorites simple list trigger */}
          <button
            id="favorites-menu-btn"
            onClick={onOpenFavorites}
            className="p-2 text-slate-600 hover:text-pink-500 dark:text-slate-300 dark:hover:text-pink-400 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors relative cursor-pointer"
            title="Wishlist / Favorites"
          >
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Animated Shopping Cart menu launcher */}
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all relative flex items-center justify-center gap-1.5 cursor-pointer transform active:scale-95"
            title="Open cart"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs font-bold hidden sm:inline">Cart</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black rounded-full h-5 px-1.5 flex items-center justify-center shadow-md animate-scale">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* User Sign-In Action or Profile Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                id="user-profile-menu-trigger"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1 p-0.5 rounded-full border-2 border-amber-500/80 hover:border-amber-500 transition-colors cursor-pointer"
                title={currentUser.displayName || 'User Profile'}
              >
                {currentUser.photoURL ? (
                  <img
                    id="user-profile-avatar"
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Profile'}
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
              </button>
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    id="user-profile-dropdown"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800/40 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800/30">
                      <p className="text-xs font-black text-slate-800 dark:text-white truncate">
                        {currentUser.displayName || 'Valued diner'}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-505 truncate mt-0.5">
                        {currentUser.email}
                      </p>
                    </div>
                    <button
                      id="user-signout-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              id="user-signin-trigger"
              onClick={onLogin}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-amber-500/15 cursor-pointer transform active:scale-95"
              title="Sign in with Google"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}

          {/* Hamburger Mobile Menu toggle trigger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 lg:hidden transition-colors cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800"
          >
            <div className="px-5 py-4 space-y-1">
              {/* Mobile custom interactive search input */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="search-input-mobile"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search dishes (e.g. Biryani, Pizza)..."
                    className="w-full pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  {searchQuery && (
                    <button
                      id="search-clear-mobile"
                      onClick={() => onSearchChange('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className="block px-4 py-3 text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-amber-500 dark:hover:text-amber-400 rounded-xl transition-all"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-850">
                {currentUser ? (
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-3">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || 'Profile'}
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white text-md font-bold">
                          {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-850 dark:text-white leading-none">{currentUser.displayName || 'Valued diner'}</h4>
                        <span className="text-xs text-slate-400 block mt-1">{currentUser.email}</span>
                      </div>
                    </div>
                    <button
                      id="mobile-signout-btn"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-55 rounded-xl cursor-pointer"
                      title="Sign Out"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    id="mobile-signin-btn"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogin();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-md cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In with Google
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
