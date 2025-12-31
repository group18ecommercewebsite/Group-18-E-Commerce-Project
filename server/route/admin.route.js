import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
    getAllOrders,
    updateOrderStatus,
    getDashboardStats,
    getOrderDetails,
    getAllUsers,
    deleteUser,
    updateUserRole,
    getCancellationRequests,
    markAsRefunded,
    getAllCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon
} from '../controllers/admin.controller.js';

const adminRouter = Router();

// Middleware kiểm tra admin role (có thể thêm sau)
// const adminOnly = (req, res, next) => {
//     if (req.userRole !== 'ADMIN') {
//         return res.status(403).json({ message: 'Admin only', error: true });
//     }
//     next();
// };

// Dashboard statistics
adminRouter.get('/dashboard-stats', auth, getDashboardStats);

// Orders management
adminRouter.get('/orders', auth, getAllOrders);
adminRouter.get('/orders/:orderId', auth, getOrderDetails);
adminRouter.put('/orders/:orderId/status', auth, updateOrderStatus);

// Cancellation requests (refund management)
adminRouter.get('/cancellation-requests', auth, getCancellationRequests);
adminRouter.put('/mark-refunded/:orderId', auth, markAsRefunded);

// Users management
adminRouter.get('/users', auth, getAllUsers);
adminRouter.delete('/users/:userId', auth, deleteUser);
adminRouter.put('/users/:userId/role', auth, updateUserRole);

// Coupon management
adminRouter.get('/coupons', auth, getAllCoupons);
adminRouter.post('/coupons', auth, createCoupon);
adminRouter.put('/coupons/:id', auth, updateCoupon);
adminRouter.delete('/coupons/:id', auth, deleteCoupon);

export default adminRouter;

