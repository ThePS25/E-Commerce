export const normalizeCouponCode = (code = "") => String(code).trim().toUpperCase();

export const isCouponValid = (coupon, orderTotal = 0) => {
  if (!coupon || !coupon.isActive) {
    return { valid: false, message: "Coupon is not active" };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, message: "Coupon has expired" };
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, message: "Coupon usage limit reached" };
  }

  if (orderTotal < (coupon.minOrder || 0)) {
    return {
      valid: false,
      message: `Minimum order of $${coupon.minOrder} required`,
    };
  }

  return { valid: true };
};

export const calculateDiscount = (coupon, orderTotal) => {
  if (!coupon) return 0;

  if (coupon.discountType === "fixed") {
    return Math.min(orderTotal, coupon.discountValue);
  }

  const percent = Math.min(100, Math.max(0, coupon.discountValue));
  return Number(((orderTotal * percent) / 100).toFixed(2));
};
