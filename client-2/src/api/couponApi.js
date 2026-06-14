import axiosClient from './axiosClient';

export const couponApi = {
  getActive: () => axiosClient.get('/coupon/active'),
  validate: (code, orderTotal) =>
    axiosClient.post('/coupon/validate', { code, orderTotal }),
  getAll: () => axiosClient.get('/coupon/all-coupons'),
  create: (data) => axiosClient.post('/coupon/create-coupon', data),
  update: (id, data) => axiosClient.put(`/coupon/update-coupon/${id}`, data),
  delete: (id) => axiosClient.delete(`/coupon/delete-coupon/${id}`),
};

export default couponApi;
