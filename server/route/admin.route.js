import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
    getAllOrders,
    updateOrderStatus,
    getDashboardStats,
    getOrderDetails
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

export default adminRouter;
