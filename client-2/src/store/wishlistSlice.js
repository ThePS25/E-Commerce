import { createSlice } from '@reduxjs/toolkit';
import { getStoredWishlist, setStoredWishlist } from '@/utils/storage';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: getStoredWishlist(),
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((i) => i._id === product._id);
      if (exists) {
        state.items = state.items.filter((i) => i._id !== product._id);
      } else {
        state.items.push(product);
      }
      setStoredWishlist(state.items);
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      setStoredWishlist(state.items);
    },
    hydrateWishlist: (state) => {
      state.items = getStoredWishlist();
    },
  },
});

export const { toggleWishlist, removeFromWishlist, hydrateWishlist } = wishlistSlice.actions;
export const selectWishlistIds = (state) => state.wishlist.items.map((i) => i._id);
export default wishlistSlice.reducer;
