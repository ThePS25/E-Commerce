import axiosClient from './axiosClient';

export const productApi = {
  getAll: () => axiosClient.get('/product/get-product'),
  getBySlug: (slug) => axiosClient.get(`/product/get-product/${slug}`),
  getPaginated: (page) => axiosClient.get(`/product/product-list/${page}`),
  getCount: () => axiosClient.get('/product/product-count'),
  search: (keyword) => axiosClient.get(`/product/search/${keyword}`),
  getRelated: (pid, cid) => axiosClient.get(`/product/related-product/${pid}/${cid}`),
  getByCategory: (slug) => axiosClient.get(`/product/product-category/${slug}`),
  filter: (payload) => axiosClient.post('/product/product-filters', payload),
  create: (formData) =>
    axiosClient.post('/product/create-product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (pid, formData) =>
    axiosClient.put(`/product/update-product/${pid}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (pid) => axiosClient.delete(`/product/delete-product/${pid}`),
  getBraintreeToken: () => axiosClient.get('/product/braintree/token'),
  processPayment: (payload) => axiosClient.post('/product/braintree/payment', payload),
  placeCodOrder: (payload) => axiosClient.post('/product/cod/order', payload),
};

export default productApi;
