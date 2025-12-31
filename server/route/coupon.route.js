import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { validateCouponController, getActiveCouponsController } from '../controllers/coupon.controller.js';

const couponRouter = Router();

// Validate coupon (user phải login)
couponRouter.post('/validate', auth, validateCouponController);

// Get active coupons (public - không cần login)
couponRouter.get('/list', getActiveCouponsController);

export default couponRouter;
