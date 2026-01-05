import express from 'express';
import auth from '../middlewares/auth.js';
import {
    createOrderController,
    getMyOrdersController,
    getOrderByIdController,
    cancelOrderController
} from '../controllers/order.controller.js';

const orderRouter = express.Router();

// Create order (COD)
orderRouter.post('/create', auth, createOrderController);

// Get user's orders
orderRouter.get('/my-orders', auth, getMyOrdersController);

// Cancel order
orderRouter.post('/cancel/:orderId', auth, cancelOrderController);

// Get order by ID
orderRouter.get('/:orderId', auth, getOrderByIdController);

export default orderRouter;

