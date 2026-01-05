import { Router } from 'express';
import auth, { optionalAuth } from '../middlewares/auth.js';
import { validateCouponController, getActiveCouponsController } from '../controllers/coupon.controller.js';

const couponRouter = Router();

// Validate coupon (user phải login)
couponRouter.post('/validate', auth, validateCouponController);

// Get active coupons (optionalAuth - lọc mã đã dùng nếu login)
couponRouter.get('/list', optionalAuth, getActiveCouponsController);

export default couponRouter;
