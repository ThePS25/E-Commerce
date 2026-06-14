import couponModel from "../models/couponModel.js";
import {
  normalizeCouponCode,
  isCouponValid,
  calculateDiscount,
} from "../helpers/couponHelper.js";

export const createCouponController = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrder,
      maxUses,
      isActive,
      expiresAt,
    } = req.body;

    if (!code || discountValue === undefined) {
      return res.status(400).json({ success: false, message: "Code and discount value are required" });
    }

    const existing = await couponModel.findOne({ code: normalizeCouponCode(code) });
    if (existing) {
      return res.status(200).json({ success: false, message: "Coupon code already exists" });
    }

    const coupon = await couponModel.create({
      code: normalizeCouponCode(code),
      description,
      discountType,
      discountValue,
      minOrder,
      maxUses: maxUses === "" || maxUses === null ? null : maxUses,
      isActive: isActive !== false,
      expiresAt: expiresAt || null,
    });

    res.status(201).json({ success: true, message: "Coupon created", coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating coupon", error });
  }
};

export const getAllCouponsController = async (req, res) => {
  try {
    const coupons = await couponModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching coupons", error });
  }
};

export const getActiveCouponsController = async (req, res) => {
  try {
    const coupons = await couponModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .select("code description discountType discountValue minOrder expiresAt");

    const now = new Date();
    const active = coupons.filter(
      (c) => !c.expiresAt || new Date(c.expiresAt) >= now
    );

    res.status(200).json({ success: true, coupons: active });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching active coupons", error });
  }
};

export const updateCouponController = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (payload.code) payload.code = normalizeCouponCode(payload.code);
    if (payload.maxUses === "") payload.maxUses = null;

    const coupon = await couponModel.findByIdAndUpdate(id, payload, { new: true });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({ success: true, message: "Coupon updated", coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating coupon", error });
  }
};

export const deleteCouponController = async (req, res) => {
  try {
    const { id } = req.params;
    await couponModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting coupon", error });
  }
};

export const validateCouponController = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const coupon = await couponModel.findOne({ code: normalizeCouponCode(code) });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    const validation = isCouponValid(coupon, Number(orderTotal) || 0);
    if (!validation.valid) {
      return res.status(200).json({ success: false, message: validation.message });
    }

    const discountAmount = calculateDiscount(coupon, Number(orderTotal) || 0);

    res.status(200).json({
      success: true,
      message: "Coupon applied",
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error validating coupon", error });
  }
};

export const applyCouponToOrder = async (couponCode, orderTotal) => {
  if (!couponCode) return { discount: 0, coupon: null };

  const coupon = await couponModel.findOne({ code: normalizeCouponCode(couponCode) });
  const validation = isCouponValid(coupon, orderTotal);

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const discount = calculateDiscount(coupon, orderTotal);
  return { discount, coupon };
};
