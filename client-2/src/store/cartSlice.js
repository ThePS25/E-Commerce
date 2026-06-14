import { createSlice } from '@reduxjs/toolkit';
import { getStoredCart, setStoredCart } from '@/utils/storage';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getStoredCart(),
    promoCode: '',
    appliedCoupon: null,
  },
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
      setStoredCart(state.items);
    },
    removeFromCart: (state, action) => {
      const idx = state.items.findIndex((i) => i._id === action.payload);
      if (idx !== -1) {
        state.items.splice(idx, 1);
        setStoredCart(state.items);
      }
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const filtered = state.items.filter((i) => i._id !== productId);
      const product = state.items.find((i) => i._id === productId);
      if (product && quantity > 0) {
        const additions = Array(quantity).fill(product);
        state.items = [...filtered, ...additions];
      } else {
        state.items = filtered;
      }
      setStoredCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.promoCode = '';
      state.appliedCoupon = null;
      setStoredCart([]);
    },
    setPromoCode: (state, action) => {
      state.promoCode = action.payload;
    },
    applyCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
      state.promoCode = action.payload?.code || '';
    },
    clearCoupon: (state) => {
      state.promoCode = '';
      state.appliedCoupon = null;
    },
    hydrateCart: (state) => {
      state.items = getStoredCart();
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setPromoCode,
  applyCoupon,
  clearCoupon,
  hydrateCart,
} = cartSlice.actions;

export const selectAppliedCoupon = (state) => state.cart.appliedCoupon;
export const selectCartDiscount = (state) => state.cart.appliedCoupon?.discountAmount || 0;

export const selectCartCount = (state) => state.cart.items.length;
export const selectCartItems = (state) => state.cart.items;

export default cartSlice.reducer;
