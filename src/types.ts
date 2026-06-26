/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  isPopular?: boolean;
  isBestSeller?: boolean;
  isVeg?: boolean;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // Used to dynamically map Lucide icon names safely
  tags: string[];
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface Coupon {
  code: string;
  discount: number;
  description: string;
  minOrder: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
