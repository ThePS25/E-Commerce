import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import store from '@/store';
import AppRoutes from '@/routes/AppRoutes';
import ToastProvider from '@/components/ToastProvider';
import { verifySession } from '@/store/authSlice';
import { hydrateCart } from '@/store/cartSlice';
import { hydrateWishlist } from '@/store/wishlistSlice';
import { getStoredAuth } from '@/utils/storage';

const antTheme = {
  token: {
    colorPrimary: '#4F46E5',
    colorSuccess: '#10B981',
    colorError: '#EF4444',
    colorInfo: '#06B6D4',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};

const AppInitializer = ({ children }) => {
  useEffect(() => {
    store.dispatch(hydrateCart());
    store.dispatch(hydrateWishlist());
    if (getStoredAuth()?.token) {
      store.dispatch(verifySession());
    }
  }, []);

  return children;
};

const App = () => (
  <Provider store={store}>
    <HelmetProvider>
      <ConfigProvider theme={antTheme}>
        <BrowserRouter>
          <AppInitializer>
            <AppRoutes />
            <ToastProvider />
          </AppInitializer>
        </BrowserRouter>
      </ConfigProvider>
    </HelmetProvider>
  </Provider>
);

export default App;
