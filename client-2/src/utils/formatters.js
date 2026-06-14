export const formatPrice = (price, currency = 'USD') =>
  Number(price).toLocaleString('en-US', { style: 'currency', currency });

export const truncateText = (text, max = 100) => {
  if (!text) return '';
  return text.length <= max ? text : `${text.substring(0, max)}...`;
};

export const calcCartTotal = (items) =>
  items.reduce((sum, item) => sum + (item.price || 0), 0);

export const calcOrderTotal = (items, appliedCoupon) => {
  const subtotal = calcCartTotal(items);
  const discount = appliedCoupon?.discountAmount || 0;
  return Math.max(0, subtotal - discount);
};

export const formatCouponLabel = (coupon) => {
  if (!coupon) return '';
  if (coupon.discountType === 'fixed') {
    return `$${coupon.discountValue} off`;
  }
  return `${coupon.discountValue}% off`;
};

export const groupCartItems = (cart) => {
  const map = new Map();
  cart.forEach((item) => {
    const existing = map.get(item._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      map.set(item._id, { ...item, quantity: 1 });
    }
  });
  return Array.from(map.values());
};
