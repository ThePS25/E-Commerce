import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createCouponController,
  deleteCouponController,
  getActiveCouponsController,
  getAllCouponsController,
  updateCouponController,
  validateCouponController,
} from "../controllers/couponController.js";

const router = express.Router();

router.get("/active", getActiveCouponsController);
router.post("/validate", validateCouponController);

router.get("/all-coupons", requireSignIn, isAdmin, getAllCouponsController);
router.post("/create-coupon", requireSignIn, isAdmin, createCouponController);
router.put("/update-coupon/:id", requireSignIn, isAdmin, updateCouponController);
router.delete("/delete-coupon/:id", requireSignIn, isAdmin, deleteCouponController);

export default router;
