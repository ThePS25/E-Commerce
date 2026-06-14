import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    viewMode: 'grid',
    sidebarOpen: false,
    searchQuery: '',
    filtersOpen: false,
  },
  reducers: {
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleFilters: (state) => {
      state.filtersOpen = !state.filtersOpen;
    },
  },
});

export const {
  setViewMode,
  toggleSidebar,
  setSidebarOpen,
  setSearchQuery,
  toggleFilters,
} = uiSlice.actions;

export default uiSlice.reducer;
