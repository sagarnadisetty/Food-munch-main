/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import FoodMenu from './components/FoodMenu';
import CartModal from './components/CartModal';
import SpecialOffers from './components/SpecialOffers';
import Reviews from './components/Reviews';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { FoodItem, CartItem, ToastMessage } from './types';
import { ChevronUp, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Connect with newly populated Firebase services
import { auth, db, loginWithGoogle, logoutUser, OperationType, handleFirestoreError } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isFavoritesOnly, setIsFavoritesOnly] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 1. Initial Loading Animation effect (1 second simulation to present a smooth brand experience)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  // 2. Load initially from LocalStorage, subscribe to Firebase Auth for state change & sync
  useEffect(() => {
    const storedCart = localStorage.getItem('food_munch_cart');
    const storedFavs = localStorage.getItem('food_munch_favs');
    if (storedCart) {
      try { setCart(JSON.parse(storedCart)); } catch (e) { console.error(e); }
    }
    if (storedFavs) {
      try { setFavorites(JSON.parse(storedFavs)); } catch (e) { console.error(e); }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            let mergedCart = data.cart || [];
            let mergedFavs = data.favorites || [];

            // Grab existing local storage guest items and merge
            const localCartStr = localStorage.getItem('food_munch_cart');
            const localFavsStr = localStorage.getItem('food_munch_favs');
            let hasMadeChanges = false;

            if (localCartStr) {
              try {
                const localCart: CartItem[] = JSON.parse(localCartStr);
                if (localCart.length > 0) {
                  localCart.forEach((guestItem) => {
                    const idx = mergedCart.findIndex((c: any) => c.item.id === guestItem.item.id);
                    if (idx > -1) {
                      if (mergedCart[idx].quantity < guestItem.quantity) {
                        mergedCart[idx].quantity = guestItem.quantity;
                        hasMadeChanges = true;
                      }
                    } else {
                      mergedCart.push(guestItem);
                      hasMadeChanges = true;
                    }
                  });
                }
              } catch (err) {
                console.error(err);
              }
            }

            if (localFavsStr) {
              try {
                const localFavs: string[] = JSON.parse(localFavsStr);
                localFavs.forEach((id) => {
                  if (!mergedFavs.includes(id)) {
                    mergedFavs.push(id);
                    hasMadeChanges = true;
                  }
                });
              } catch (err) {
                console.error(err);
              }
            }

            setCart(mergedCart);
            setFavorites(mergedFavs);

            // Clean local storage items because we merged them to cloud
            localStorage.setItem('food_munch_cart', JSON.stringify(mergedCart));
            localStorage.setItem('food_munch_favs', JSON.stringify(mergedFavs));

            if (hasMadeChanges) {
              await updateDoc(userDocRef, {
                cart: mergedCart,
                favorites: mergedFavs,
                updatedAt: serverTimestamp()
              });
              addToast('Merged guest items to your persistent account!', 'info');
            }
          } else {
            // Document does not exist. Initialize user profile with guest local data
            const initialUserData = {
              userId: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              cart: cart,
              favorites: favorites,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            await setDoc(userDocRef, initialUserData);
          }
        } catch (error) {
          console.error("error fetching or initializing user profiles:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const saveCartToLocalStorage = async (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('food_munch_cart', JSON.stringify(newCart));

    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await updateDoc(userDocRef, {
          cart: newCart,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }
    }
  };

  const saveFavsToLocalStorage = async (newFavs: string[]) => {
    setFavorites(newFavs);
    localStorage.setItem('food_munch_favs', JSON.stringify(newFavs));

    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await updateDoc(userDocRef, {
          favorites: newFavs,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }
    }
  };

  // Google Login / Logout handlers
  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      addToast(`Welcome to Food Munch, ${user.displayName || 'diners'}! 🎉`, 'success');
    } catch (err) {
      addToast('Authentication failed. Please try again.', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      addToast('Successfully signed out.', 'info');
    } catch (err) {
      addToast('Failed to sign out.', 'error');
    }
  };

  // 3. Back to Top Button scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. Toast notification factory
  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, message, type };
    setToasts((prev) => [...prev, newToast]);
    
    // Auto remove toast after 3.5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 5. Shopping Cart Operations
  const handleAddToCart = (item: FoodItem) => {
    const existingIndex = cart.findIndex((c) => c.item.id === item.id);
    let updatedCart = [...cart];

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += 1;
      addToast(`Increased ${item.name} quantity to ${updatedCart[existingIndex].quantity}`, 'success');
    } else {
      updatedCart.push({ item, quantity: 1 });
      addToast(`"${item.name}" added to Cart! 🍔`, 'success');
    }
    saveCartToLocalStorage(updatedCart);
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    let updatedCart = [...cart];
    const index = cart.findIndex((c) => c.item.id === itemId);
    
    if (index === -1) return;

    if (newQty <= 0) {
      const deletedItemName = updatedCart[index].item.name;
      updatedCart.splice(index, 1);
      addToast(`Removed "${deletedItemName}" from cart.`, 'info');
    } else {
      updatedCart[index].quantity = newQty;
    }
    saveCartToLocalStorage(updatedCart);
  };

  const handleRemoveFromCart = (itemId: string) => {
    const updatedCart = cart.filter((c) => c.item.id !== itemId);
    saveCartToLocalStorage(updatedCart);
  };

  const handleClearCart = () => {
    saveCartToLocalStorage([]);
  };

  // 6. Favorites Wishlist Operations
  const handleToggleFavorite = (itemId: string) => {
    let updatedFavs = [...favorites];
    if (favorites.includes(itemId)) {
      updatedFavs = updatedFavs.filter((id) => id !== itemId);
      addToast('Removed item from Wishlist.', 'info');
    } else {
      updatedFavs.push(itemId);
      addToast('Added item to Wishlist! ❤️', 'success');
    }
    saveFavsToLocalStorage(updatedFavs);
  };

  // 7. Navigation Scroll Trigger Helper
  const handleScrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-350 select-none overflow-x-hidden antialiased">
      <AnimatePresence>
        {isLoading ? (
          /* A. Splash Loading Screen */
          <motion.div
            id="splash-loader"
            key="loader"
            className="fixed inset-0 z-[110] bg-slate-900 flex flex-col items-center justify-center text-center gap-4 text-white"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full"
              />
              <span className="absolute inset-0 flex items-center justify-center text-md font-black text-amber-500">
                FM
              </span>
            </div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
            >
              Food Munch
            </motion.h2>
            <p className="text-xs text-slate-450 tracking-widest uppercase font-mono">Preparing Hot Boxes...</p>
          </motion.div>
        ) : (
          /* B. Main Application Workspace Frame */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen"
          >
            {/* 1. Header Toolbar */}
            <Navbar
              cart={cart}
              onOpenCart={() => setIsCartOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              favoritesCount={favorites.length}
              onOpenFavorites={() => {
                setIsFavoritesOnly(!isFavoritesOnly);
                handleScrollToMenu();
              }}
              currentUser={currentUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />

            {/* 2. Hero Interactive Banner details */}
            <Hero
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onScrollToMenu={handleScrollToMenu}
            />

            {/* 3. Favorite Category Sorters */}
            <Categories
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setIsFavoritesOnly(false); // clear favorited toggle so category fits
              }}
              onScrollToMenu={handleScrollToMenu}
            />

            {/* B.1 Favorite only alert mode indicator banner */}
            {isFavoritesOnly && (
              <div id="favorites-badge" className="max-w-7xl mx-auto px-4 md:px-6 w-full pt-8">
                <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">❤️</span>
                    <div>
                      <h4 className="text-sm font-bold text-pink-700 dark:text-pink-400">Viewing Your Wishlist Items</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Showing only dishes starred as your favorites ({favorites.length})</p>
                    </div>
                  </div>
                  <button
                    id="reset-favs-trigger"
                    onClick={() => setIsFavoritesOnly(false)}
                    className="py-1 px-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-semibold"
                  >
                    View Full Menu
                  </button>
                </div>
              </div>
            )}

            {/* 4. Food Menu Listing */}
            <FoodMenu
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              cart={cart}
              onAddToCart={handleAddToCart}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              isFavoritesOnly={isFavoritesOnly}
            />

            {/* 5. Special Promotional Grid */}
            <SpecialOffers
              onAddComboToCart={handleAddToCart}
              addToast={addToast}
            />

            {/* 6. Ratings & Testimonials Section */}
            <Reviews
              addToast={addToast}
            />

            {/* 7. Franchise narrative panel */}
            <About />

            {/* 8. Contact & Map elements */}
            <Contact
              addToast={addToast}
            />

            {/* 9. Footers panel */}
            <Footer />

            {/* 10. Sidebar Slide-out Drawer */}
            <CartModal
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveFromCart}
              onClearCart={handleClearCart}
              addToast={addToast}
            />

            {/* 11. Toast stacks overlay */}
            <Toast
              toasts={toasts}
              onDismiss={dismissToast}
            />

            {/* 12. Float Action: Scrolling back to top */}
            <AnimatePresence>
              {showScrollTop && (
                <motion.button
                  id="float-back-top"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="fixed bottom-6 left-6 z-[80] p-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-2xl shadow-amber-500/20 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                  title="Scroll to Top"
                >
                  <ChevronUp className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
