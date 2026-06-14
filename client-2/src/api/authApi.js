import axiosClient from './axiosClient';

export const authApi = {
  signup: (data) => axiosClient.post('/auth/signup', data),
  login: (data) => axiosClient.post('/auth/login', data),
  forgotPassword: (data) => axiosClient.post('/auth/forgot-password', data),
  userAuth: () => axiosClient.get('/auth/user-auth'),
  adminAuth: () => axiosClient.get('/auth/admin-auth'),
  updateProfile: (data) => axiosClient.put('/auth/profile', data),
  getOrders: () => axiosClient.get('/auth/orders'),
  getAllOrders: () => axiosClient.get('/auth/all-orders'),
  updateOrderStatus: (orderId, status) =>
    axiosClient.put(`/auth/order-status/${orderId}`, { status }),
};

export default authApi;
