/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, X, Tag, ShieldCheck, ShoppingCart, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { COUPONS } from '../data';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  addToast,
}: CartModalProps) {
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Checkout form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const subtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  
  // Free delivery over ₹250
  const deliveryFee = subtotal >= 250 || subtotal === 0 ? 0 : 30;
  
  // Coupon deduction
  let couponDiscount = 0;
  if (activeCoupon && subtotal >= activeCoupon.minOrder) {
    if (activeCoupon.code === 'FM40') {
      // 40% off up to ₹100
      couponDiscount = Math.min(Math.round(subtotal * 0.4), 100);
    } else if (activeCoupon.code === 'FREECOOKIES') {
      couponDiscount = 50;
    } else if (activeCoupon.code === 'FESTIVAL75') {
      couponDiscount = 75;
    }
  }

  const grandTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const found = COUPONS.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    
    if (!found) {
      addToast('Invalid Coupon Code!', 'error');
      return;
    }

    if (subtotal < found.minOrder) {
      addToast(`Minimum order of ₹${found.minOrder} required for ${found.code}!`, 'error');
      return;
    }

    setActiveCoupon(found);
    addToast(`Coupon "${found.code}" applied successfully! Saved ₹${found.code === 'FM40' ? Math.min(Math.round(subtotal * 0.4), 100) : found.discount === 50 ? 50 : 75}`, 'success');
  };

  const handleApplyCouponDirectly = (coupon: Coupon) => {
    if (subtotal < coupon.minOrder) {
      addToast(`Minimum order of ₹${coupon.minOrder} required!`, 'error');
      return;
    }
    setActiveCoupon(coupon);
    setCouponCode(coupon.code);
    addToast(`Coupon "${coupon.code}" applied!`, 'success');
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setCouponCode('');
    addToast('Coupon removed.', 'info');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      addToast('Please fill out all delivery fields.', 'error');
      return;
    }
    if (phone.length < 10) {
      addToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    
    setOrderPlaced(true);
    addToast('Order placed successfully! Deliciousness is on the way!', 'success');
    onClearCart();
  };

  const handleReset = () => {
    setOrderPlaced(false);
    setIsCheckingOut(false);
    setActiveCoupon(null);
    setCouponCode('');
    setName('');
    setPhone('');
    setAddress('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-xs"
          />

          {/* Sidebar Drawer */}
          <motion.div
            id="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:max-w-md bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 shadow-2xl z-[95] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-500 text-white rounded-tl-2xl">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 animate-pulse" />
                <h3 className="text-lg font-bold tracking-tight">Your Restaurant Order</h3>
                <span className="bg-white text-amber-600 text-xs font-bold rounded-full h-5 px-2 flex items-center justify-center">
                  {cart.reduce((s, c) => s + c.quantity, 0)}
                </span>
              </div>
              <button
                id="close-cart-btn"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
                aria-label="Close Cart"
              >
                <X className="w-5 h-5 pointer-events-none" />
              </button>
            </div>

            {/* Sidebar content body */}
            <div className="flex-grow overflow-y-auto p-5 custom-scrollbar">
              {orderPlaced ? (
                /* Celebration order confirmation page */
                <motion.div
                  id="checkout-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col justify-center items-center text-center px-4"
                >
                  <div className="relative mb-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
                    </motion.div>
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Order Confirmed!</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Hi <span className="font-semibold text-slate-800 dark:text-slate-200">{name}</span>, your delicious order is accepted and will reach <span className="font-semibold">{address}</span> in about <span className="font-bold text-amber-500">30 minutes</span>!
                  </p>
                  
                  <div className="w-full bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-left mb-6">
                    <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono mb-2">Order Details</div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 mb-1">
                      <span>Delivery Details:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{phone}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                      <span>Paid via:</span>
                      <span className="font-medium uppercase text-emerald-600 dark:text-emerald-400">
                        {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment Card'}
                      </span>
                    </div>
                  </div>

                  <button
                    id="order-more-btn"
                    onClick={handleReset}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Browse More Dishes
                  </button>
                </motion.div>
              ) : isCheckingOut ? (
                /* Checkout Form Layer */
                <motion.div
                  id="checkout-form-container"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <button
                    id="back-to-cart-btn"
                    onClick={() => setIsCheckingOut(false)}
                    className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Cart
                  </button>

                  <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-900/30 p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-1 uppercase tracking-wide">Summary</h4>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">Amount Due: ₹{grandTotal}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{cart.reduce((s,c) => s + c.quantity, 0)} freshly prepared delicacies</p>
                  </div>

                  <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Your Name</label>
                      <input
                        id="checkout-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                      <input
                        id="checkout-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Delivery Address</label>
                      <textarea
                        id="checkout-address"
                        required
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Apartment, Street Name, Landmark, Bengaluru, Karnataka"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Payment Method</label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className={`border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${
                          paymentMethod === 'cod'
                            ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/5 text-amber-700 dark:text-amber-400 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                        }`}>
                          <span className="text-sm">Cash on Delivery</span>
                          <input
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="text-amber-500 focus:ring-amber-500"
                          />
                        </label>

                        <label className={`border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${
                          paymentMethod === 'card'
                            ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/5 text-amber-700 dark:text-amber-400 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                        }`}>
                          <span className="text-sm">Credit / Debit Card</span>
                          <input
                            type="radio"
                            name="payment"
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                            className="text-amber-500 focus:ring-amber-500"
                          />
                        </label>
                      </div>
                    </div>

                    <button
                      id="submit-order-btn"
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      Place Secure Order
                    </button>
                  </form>
                </motion.div>
              ) : cart.length === 0 ? (
                /* Empty Cart screen */
                <div id="empty-cart-view" className="h-[70vh] flex flex-col justify-center items-center text-center">
                  <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/10 rounded-full flex items-center justify-center mb-4 text-amber-600">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-700 dark:text-white">Your shopping cart is empty</h4>
                  <p className="text-sm text-slate-400 dark:text-slate-500 max-w-[250px] mt-2 mb-6">
                    Add healthy platters & special combo treats from our interactive menu to satisfy your cravings.
                  </p>
                  <button
                    id="cart-continue-shopping-btn"
                    onClick={onClose}
                    className="py-2.5 px-6 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-all shadow-md"
                  >
                    Explore Menu Items
                  </button>
                </div>
              ) : (
                /* Regular Cart Items view */
                <div className="space-y-6">
                  {/* Cart Items list */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dishes Selected</p>
                    {cart.map(({ item, quantity }) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`w-2.5 h-2.5 border flex-shrink-0 relative ${
                              item.isVeg ? 'border-emerald-600' : 'border-red-600'
                            }`}>
                              <span className={`absolute inset-[1px] rounded-full ${
                                item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                              }`} />
                            </span>
                            <h5 className="text-sm font-bold text-slate-800 dark:text-white truncate">
                              {item.name}
                            </h5>
                          </div>
                          <p className="text-sm font-extrabold text-amber-600">
                            ₹{item.price}
                          </p>

                          {/* Plus and minus, quantity selector */}
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg">
                              <button
                                id={`cart-minus-${item.id}`}
                                onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                                className="p-1 text-slate-500 hover:text-amber-500 focus:outline-none"
                              >
                                <Minus className="w-3.5 h-3.5 pointer-events-none" />
                              </button>
                              <span className="px-2.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                                {quantity}
                              </span>
                              <button
                                id={`cart-plus-${item.id}`}
                                onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                                className="p-1 text-slate-500 hover:text-amber-500 focus:outline-none"
                              >
                                <Plus className="w-3.5 h-3.5 pointer-events-none" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove item button */}
                        <button
                          id={`cart-remove-${item.id}`}
                          onClick={() => {
                            onRemoveItem(item.id);
                            addToast(`Removed ${item.name} from cart`, 'info');
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all"
                          title="Remove item"
                        >
                          <Trash2 className="w-4.5 h-4.5 pointer-events-none" />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Coupon section widget */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Apply Promo Coupons</p>
                    
                    {!activeCoupon ? (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-grow">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            id="coupon-input"
                            type="text"
                            placeholder="Enter Code (e.g. FM40)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 tracking-wider text-slate-700 dark:text-white font-mono uppercase"
                          />
                        </div>
                        <button
                          id="coupon-apply-btn"
                          type="submit"
                          className="py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-all"
                        >
                          Apply
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/30 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4.5 h-4.5 text-emerald-600" />
                          <div>
                            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 font-mono tracking-wider">{activeCoupon.code}</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-500 ml-2">Active Discount</span>
                          </div>
                        </div>
                        <button
                          id="coupon-remove-btn"
                          onClick={handleRemoveCoupon}
                          className="text-[10px] font-semibold text-rose-600 hover:underline dark:text-rose-400"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Quick coupon picks list when none active */}
                    {!activeCoupon && (
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        {COUPONS.map((coupon) => {
                          const isEligible = subtotal >= coupon.minOrder;
                          return (
                            <button
                              id={`quick-coupon-${coupon.code}`}
                              type="button"
                              key={coupon.code}
                              onClick={() => handleApplyCouponDirectly(coupon)}
                              className={`text-left p-2 border rounded-xl flex items-center justify-between transition-all ${
                                isEligible
                                  ? 'border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:bg-amber-50/20'
                                  : 'border-slate-100 dark:border-slate-800/40 opacity-70 cursor-not-allowed'
                              }`}
                            >
                              <div>
                                <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300 font-mono tracking-wide">{coupon.code}</p>
                                <p className="text-[10px] text-slate-400">{coupon.description}</p>
                              </div>
                              <span className={`text-[10px] font-bold py-0.5 px-2 rounded-full ${
                                isEligible ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                              }`}>
                                {isEligible ? 'Use' : `Min ₹${coupon.minOrder}`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Total recap sidebar footer */}
            {!orderPlaced && cart.length > 0 && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex-shrink-0">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">₹{subtotal}</span>
                  </div>
                  
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                      <span>Discount Coupon</span>
                      <span className="font-semibold">-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>Delivery Charges</span>
                    {deliveryFee === 0 ? (
                      <span className="text-xs font-bold text-emerald-600 uppercase bg-emerald-100 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">Free</span>
                    ) : (
                      <span className="font-semibold text-slate-700 dark:text-slate-300">₹{deliveryFee}</span>
                    )}
                  </div>
                  
                  {deliveryFee > 0 && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 text-right italic">
                      Add ₹{250 - subtotal} more for FREE Delivery!
                    </p>
                  )}

                  <div className="h-[1px] bg-slate-200 dark:bg-slate-800 my-1" />

                  <div className="flex justify-between text-lg font-black text-slate-800 dark:text-white">
                    <span>Grand Total</span>
                    <span className="text-amber-500 font-extrabold">₹{grandTotal}</span>
                  </div>
                </div>

                {!isCheckingOut ? (
                  <button
                    id="checkout-proceed-btn"
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 italic">
                    Fill out the delivery form above to confirm your meal.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
