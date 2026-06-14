import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

const Home = lazy(() => import('@/pages/Home'));
const ProductListing = lazy(() => import('@/pages/ProductListing'));
const ProductDetails = lazy(() => import('@/pages/ProductDetails'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const SearchResults = lazy(() => import('@/pages/SearchResults'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Policy = lazy(() => import('@/pages/Policy'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const Login = lazy(() => import('@/pages/auth/Login'));
const Signup = lazy(() => import('@/pages/auth/Signup'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));

const UserDashboard = lazy(() => import('@/pages/user/UserDashboard'));
const Orders = lazy(() => import('@/pages/user/Orders'));
const Wishlist = lazy(() => import('@/pages/user/Wishlist'));
const Profile = lazy(() => import('@/pages/user/Profile'));
const Addresses = lazy(() => import('@/pages/user/Addresses'));
const Settings = lazy(() => import('@/pages/user/Settings'));

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const CreateProduct = lazy(() => import('@/pages/admin/CreateProduct'));
const UpdateProduct = lazy(() => import('@/pages/admin/UpdateProduct'));
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminCoupons = lazy(() => import('@/pages/admin/AdminCoupons'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));

const PageLoader = () => (
  <div className="page-loader">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductListing />} />
        <Route path="products/:slug" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="policy" element={<Policy />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="dashboard/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="dashboard/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="dashboard/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
        <Route path="dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
        <Route path="admin/products/create" element={<ProtectedRoute adminOnly><CreateProduct /></ProtectedRoute>} />
        <Route path="admin/products/:slug/edit" element={<ProtectedRoute adminOnly><UpdateProduct /></ProtectedRoute>} />
        <Route path="admin/categories" element={<ProtectedRoute adminOnly><AdminCategories /></ProtectedRoute>} />
        <Route path="admin/coupons" element={<ProtectedRoute adminOnly><AdminCoupons /></ProtectedRoute>} />
        <Route path="admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
        <Route path="admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route index element={<Navigate to="login" replace />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
