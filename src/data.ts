/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FoodItem, Category, Review, Coupon } from './types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Items', iconName: 'Flame', tags: [] },
  { id: 'biryani', name: 'Biryani', iconName: 'Sparkles', tags: ['rice', 'biryani', 'spicy'] },
  { id: 'pizza', name: 'Pizza', iconName: 'Pizza', tags: ['italian', 'pizza', 'cheese'] },
  { id: 'burgers', name: 'Burgers', iconName: 'Beef', tags: ['burger', 'american', 'fast-food'] },
  { id: 'south-indian', name: 'South Indian', iconName: 'Utensils', tags: ['dosa', 'indian', 'vegetarian'] },
  { id: 'chinese', name: 'Chinese', iconName: 'Soup', tags: ['noodles', 'chinese', 'asian'] },
  { id: 'desserts', name: 'Desserts', iconName: 'Cake', tags: ['sweet', 'bakery', 'chocolate'] },
  { id: 'beverages', name: 'Beverages', iconName: 'Coffee', tags: ['drink', 'shakes', 'beverage'] }
];

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'b1',
    name: 'Chicken Biryani',
    description: 'Juicy chicken cooked with premium long-grain Basmati rice, rich Indian spices, and visual layers of saffron and herbs. Served with cooling raita.',
    category: 'biryani',
    price: 249,
    rating: 4.8,
    reviewsCount: 2500,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    isBestSeller: true,
    isVeg: false
  },
  {
    id: 'b2',
    name: 'Veg Biryani',
    description: 'A fragrant medley of garden-fresh vegetables layered with aromatic rice, traditional hot spices, mint, and toasted golden onions.',
    category: 'biryani',
    price: 199,
    rating: 4.6,
    reviewsCount: 1200,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    isPopular: false,
    isBestSeller: false,
    isVeg: true
  },
  {
    id: 'p1',
    name: 'Margherita Pizza',
    description: 'Classic Italian thin-crust Pizza topped with home-style rich tomato sauce, premium bubbly mozzarella, and fresh hand-torn basil leaves.',
    category: 'pizza',
    price: 299,
    rating: 4.7,
    reviewsCount: 1850,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    isBestSeller: true,
    isVeg: true
  },
  {
    id: 'bu1',
    name: 'Chicken Burger',
    description: 'Crispy butter-fried chicken breast, crisp lettuce, farm-fresh tomatoes, and our proprietary spicy house ranch style dressing on soft potato buns.',
    category: 'burgers',
    price: 179,
    rating: 4.5,
    reviewsCount: 950,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    isVeg: false
  },
  {
    id: 'bu2',
    name: 'Double Patty Cheese Burger',
    description: 'Two premium flame-broiled beef-style custom patties with melted double cheddar, pickles, crisp sweet onions, and yellow mustard-mayo sauce.',
    category: 'burgers',
    price: 229,
    rating: 4.8,
    reviewsCount: 1400,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    isBestSeller: true,
    isVeg: false
  },
  {
    id: 's1',
    name: 'Masala Dosa',
    description: 'A crispy golden rice and lentil crepe stuffed with a spiced turmeric potato mash. Served with fresh coconut and tomato chutneys and rich piping hot sambar.',
    category: 'south-indian',
    price: 129,
    rating: 4.8,
    reviewsCount: 3100,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    isBestSeller: true,
    isVeg: true
  },
  {
    id: 's2',
    name: 'Paneer Tikka Dosa',
    description: 'Our standard crispy crepe loaded with smokey, char-grilled paneer tikka chunks, melted cheese, and robust coriander spreads.',
    category: 'south-indian',
    price: 149,
    rating: 4.6,
    reviewsCount: 780,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    isPopular: false,
    isVeg: true
  },
  {
    id: 'c1',
    name: 'Hakka Noodles',
    description: 'Stir-fried wok-tossed noodles tossed with shredded carrots, fresh bell peppers, crisp cabbage, celery, and authentic dark Chinese sauces.',
    category: 'chinese',
    price: 189,
    rating: 4.6,
    reviewsCount: 1650,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    isVeg: true
  },
  {
    id: 'c2',
    name: 'Crispy Veg Manchurian',
    description: 'Lightly battered crisp vegetable dumplings tossed in a fragrant, tangy, and hot chili-garlic-based Manchurian glaze sauce.',
    category: 'chinese',
    price: 169,
    rating: 4.5,
    reviewsCount: 890,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
    isPopular: false,
    isVeg: true
  },
  {
    id: 'd1',
    name: 'Chocolate Brownie',
    description: 'Decadent, dense double chocolate fudge brownie served hot. Beautifully soft on the inside with crisp chocolate edges.',
    category: 'desserts',
    price: 149,
    rating: 4.9,
    reviewsCount: 2100,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    isBestSeller: true,
    isVeg: true
  },
  {
    id: 'd2',
    name: 'Gulab Jamun Duo',
    description: 'Classic rich cardamon scented khoya balls deep-fried and immersed in an ultra-sweet saffron and rosewater syrup. Served warm.',
    category: 'desserts',
    price: 79,
    rating: 4.8,
    reviewsCount: 1550,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    isPopular: false,
    isVeg: true
  },
  {
    id: 'be1',
    name: 'Mango Milkshake',
    description: 'Thick blended shake made with sweet ripe seasonal Alphonso mangoes, organic milk, and finished with pistachios.',
    category: 'beverages',
    price: 99,
    rating: 4.7,
    reviewsCount: 1100,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    isVeg: true
  },
  {
    id: 'be2',
    name: 'Iced Caramel Macchiato',
    description: 'Freshly pulled premium espresso poured over cold milk, dynamic vanilla syrups, and finished with rich caramel drizzle waves.',
    category: 'beverages',
    price: 129,
    rating: 4.6,
    reviewsCount: 650,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80',
    isVeg: true
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    user: 'Aarav Sharma',
    rating: 5,
    comment: 'The chicken biryani was absolute perfection! Generous portions, incredibly aromatic, and delivered steaming hot. Found my new favorite spot!',
    date: '2026-06-12',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'r2',
    user: 'Pooja Iyer',
    rating: 5,
    comment: 'The masala dosa is exceptionally authentic and crisp. Their coconut chutney is fresh, and delivery speed is incredibly lightning-fast. Highly recommended!',
    date: '2026-06-10',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'r3',
    user: 'Vikram Mehta',
    rating: 4,
    comment: 'Double Patty Burger is an absolute beast! So juicy and loaded with cheese. Brownies were awesome too. Just a tiny delay in weekend orders but totally worth it.',
    date: '2026-06-08',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'r4',
    user: 'Neha Kapoor',
    rating: 5,
    comment: 'Outstanding food quality and hygienic contactless courier! The chocolate brownie was rich and gooey, and mango milkshake felt purely fresh.',
    date: '2026-06-05',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80'
  }
];

export const COUPONS: Coupon[] = [
  {
    code: 'FM40',
    discount: 40,
    description: 'Get extra 40% OFF on all items up to ₹100',
    minOrder: 199
  },
  {
    code: 'FREECOOKIES',
    discount: 50,
    description: 'Flat ₹50 savings on any first snack order over ₹299',
    minOrder: 299
  },
  {
    code: 'FESTIVAL75',
    discount: 75,
    description: 'Flat ₹75 discount on ordering above ₹399',
    minOrder: 399
  }
];

export const SPECIAL_DEALS = [
  {
    id: 'sd1',
    title: 'Supreme Biryani Combo',
    description: 'Get Chicken Biryani, Butter Naan, and Gulab Jamun Duo + Beverage.',
    originalPrice: 427,
    dealPrice: 349,
    badge: 'Saver Combo',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'sd2',
    title: 'Double Treat Pizza Deal',
    description: 'Buy Margherita Pizza and get Iced Caramel Macchiato half price!',
    originalPrice: 428,
    dealPrice: 359,
    badge: 'Happy Hour',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'sd3',
    title: 'Veggie Delite Festival',
    description: 'Pair Veg Biryani, Hakka Noodles, and 2 Mango Shakes.',
    originalPrice: 486,
    dealPrice: 399,
    badge: 'Best Value',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
  }
];
