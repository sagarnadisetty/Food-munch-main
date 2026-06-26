import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Flame, CheckCircle, Smile, User, ThumbsUp, Trash2 } from 'lucide-react';
import { Review } from '../types';
import { REVIEWS } from '../data';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface ReviewsProps {
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function Reviews({ addToast }: ReviewsProps) {
  const [dbReviews, setDbReviews] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  
  // Custom review form state variables
  const [guestAuthor, setGuestAuthor] = useState('');
  const [userComment, setUserComment] = useState('');
  const [score, setScore] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch reviews in real-time from Firestore
  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: any[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ _docId: doc.id, ...doc.data() });
      });
      setDbReviews(fetched);
    }, (error) => {
      console.error("Firestore database connection query error on reviews:", error);
    });
    return () => unsubscribe();
  }, []);

  // Combine live reviews with hardcoded fallback testimonials for immediate rich display
  const combinedReviews = useMemo(() => {
    const presentReviews: Review[] = dbReviews.map((item) => ({
      id: item.id || item._docId,
      user: item.name,
      rating: item.rating,
      comment: item.comment,
      date: item.date || 'Today',
      avatar: item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      userId: item.userId,
      _docId: item._docId
    }));
    return [...presentReviews, ...REVIEWS];
  }, [dbReviews]);

  // Dynamically calculate average rating based on the combined list
  const reviewStats = useMemo(() => {
    const totalCount = combinedReviews.length || 1;
    const sum = combinedReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const average = (sum / totalCount).toFixed(1);

    // Distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    combinedReviews.forEach((r) => {
      const activeRating = Math.round(r.rating) as 5|4|3|2|1;
      if (distribution[activeRating] !== undefined) {
        distribution[activeRating]++;
      }
    });

    return { totalCount, average, distribution };
  }, [combinedReviews]);

  const handleLike = (id: string) => {
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDeleteReview = async (docId: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', docId));
      addToast('Review deleted successfully!', 'success');
    } catch (e) {
      addToast('Could not delete review.', 'error');
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const reviewerName = currentUser ? (currentUser.displayName || currentUser.email) : guestAuthor.trim();
    if (!reviewerName) {
      addToast('Please enter your name to complete the review.', 'error');
      return;
    }
    if (!userComment.trim()) {
      addToast('Please enter review comments text.', 'error');
      return;
    }

    const reviewId = `custom-r-${Date.now()}`;
    const newDbReview = {
      id: reviewId,
      userId: currentUser ? currentUser.uid : null,
      name: reviewerName,
      rating: score,
      comment: userComment.trim(),
      avatar: currentUser ? (currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80') : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      date: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'reviews', reviewId), newDbReview);
      addToast('Thank you! Your verified dining review has been posted.', 'success');
      
      // Clear states
      setGuestAuthor('');
      setUserComment('');
      setScore(5);
      setShowReviewForm(false);
    } catch (error) {
      console.error(error);
      addToast('Error saving review to Firestore database.', 'error');
    }
  };

  return (
    <section id="reviews" className="py-16 bg-white dark:bg-slate-900 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 text-xs font-bold rounded-full tracking-wider mb-2 uppercase">
            <MessageSquare className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Verified Testimonials
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
            What Customers Say About Food Munch
          </h2>
          <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full mt-3 mb-2" />
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Over ten thousand organic orders serviced this month. Real ratings from real neighborhood food lovers.
          </p>
        </div>

        {/* Major Visual Ratings breakdown block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Large Average Box */}
          <div className="lg:col-span-4 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 dark:from-slate-800/10 dark:to-slate-800/5 p-6 rounded-3xl border border-amber-500/10 dark:border-slate-800 text-center flex flex-col justify-center items-center">
            <p className="text-slate-400 dark:text-slate-505 text-sm font-bold uppercase tracking-widest font-mono">Verified Score</p>
            <h3 className="text-6xl sm:text-7xl font-black text-slate-800 dark:text-white my-3 leading-none">{reviewStats.average}</h3>
            
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(parseFloat(reviewStats.average))
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-200 dark:text-slate-850'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-400">Based on {reviewStats.totalCount} local reviews</p>
            <div className="h-[1px] bg-slate-100 dark:bg-slate-800/60 w-full my-4" />
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              98.4% On-Time Delivery Guarantee
            </div>
          </div>

          {/* Center Stars breakdown bar charts */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-3xl space-y-3.5">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-extrabold text-slate-700 dark:text-white uppercase tracking-wide">Rating Distribution</h4>
              <button
                id="review-write-trigger"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <Smile className="w-3.5 h-3.5" />
                Write a Review
              </button>
            </div>

            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviewStats.distribution[stars as 5|4|3|2|1] || 0;
              const pct = reviewStats.totalCount > 0 ? (count / reviewStats.totalCount) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="w-12 text-xs font-extrabold text-slate-500 text-right flex items-center justify-end gap-1">
                    {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  
                  {/* Progress track */}
                  <div className="flex-grow h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                    />
                  </div>

                  <span className="w-10 text-xs font-bold text-slate-400 text-left">
                    {pct.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Form wrapper dropdown */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              id="review-form-container"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-10 w-full"
            >
              <form onSubmit={handlePostReview} className="bg-slate-50 dark:bg-slate-800/10 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 max-w-2xl mx-auto space-y-4">
                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">Share Your Restaurant Experience</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser ? (
                    <div className="flex items-center gap-3 py-2 px-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="Posting user profile avatar"
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Posting verified as</span>
                        <span className="text-xs font-bold text-slate-805 dark:text-slate-200">{currentUser.displayName || currentUser.email}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Your Name</label>
                      <input
                        id="custom-review-author"
                        type="text"
                        required
                        placeholder="Dave Miller"
                        value={guestAuthor}
                        onChange={(e) => setGuestAuthor(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Rating Experience</label>
                    <div className="flex items-center gap-1.5 py-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          id={`star-select-${num}`}
                          type="button"
                          key={num}
                          onClick={() => setScore(num)}
                          className="focus:outline-none hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                        >
                          <Star className={`w-5 h-5 ${num <= score ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-800'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Your Feedback</label>
                  <textarea
                    id="custom-review-comment"
                    required
                    rows={3}
                    placeholder="We loved the fast delivery and fresh organic paneer tikka dosa! Definitely ordering again."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2 text-xs">
                  <button
                    id="review-cancel-btn"
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    id="review-submit-btn"
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List of customer reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {combinedReviews.map((rev) => (
            <div
              id={`review-card-${rev.id}`}
              key={rev.id}
              className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all h-full"
            >
              <div className="space-y-3">
                {/* Header author and star level */}
                <div className="flex items-center justify-between">
                  {/* User profile brief */}
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.user}
                      className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h5 className="text-sm font-extrabold text-slate-800 dark:text-white leading-none">{rev.user}</h5>
                      <span className="text-[10px] text-slate-400 mt-1 block">{rev.date}</span>
                    </div>
                  </div>

                  {/* Rating Stars list badge */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-805'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-500 dark:text-slate-405 italic leading-relaxed font-sans">
                  "{rev.comment}"
                </p>
              </div>

              {/* Verified Badge / Helpful review likes tag */}
              <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/40 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" /> Dining Customer
                </span>

                <div className="flex items-center gap-2">
                  {currentUser && rev.userId === currentUser.uid && rev._docId && (
                    <button
                      id={`delete-btn-${rev.id}`}
                      onClick={() => handleDeleteReview(rev._docId!)}
                      className="p-1 px-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg flex items-center gap-1 text-[10px] font-bold transition-all cursor-pointer"
                      title="Delete your review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}

                  <button
                    id={`review-like-${rev.id}`}
                    onClick={() => handleLike(rev.id)}
                    className="px-2 py-1 text-[10px] font-semibold text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-lg transition-all flex items-center gap-1 focus:outline-none cursor-pointer"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    Was this helpful? ({likesMap[rev.id] || 0})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
