import { authApi } from './authApi';
import { productApi } from './productApi';

export const orderApi = {
  getUserOrders: () => authApi.getOrders(),
  getAllOrders: () => authApi.getAllOrders(),
  updateStatus: (orderId, status) => authApi.updateOrderStatus(orderId, status),
  processPayment: (payload) => productApi.processPayment(payload),
  placeCodOrder: (payload) => productApi.placeCodOrder(payload),
  getBraintreeToken: () => productApi.getBraintreeToken(),
};

export default orderApi;
