import express from 'express';
import auth from '../middlewares/auth.js';
import {
    createSePayOrder,
    sePayCallback,
    getOrderPaymentStatus,
    confirmPayment
} from '../controllers/payment.controller.js';

const paymentRouter = express.Router();

// Tạo thanh toán SePay (requires auth)
paymentRouter.post('/sepay/create', auth, createSePayOrder);

// Callback từ SePay (public - được SePay gọi)
paymentRouter.post('/sepay/callback', sePayCallback);

// Xác nhận thanh toán từ client (requires auth)
paymentRouter.post('/confirm-payment', auth, confirmPayment);

// Kiểm tra trạng thái theo orderId
paymentRouter.get('/order-status/:orderId', getOrderPaymentStatus);

export default paymentRouter;
