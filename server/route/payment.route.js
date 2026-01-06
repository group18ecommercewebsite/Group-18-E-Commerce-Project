import express from 'express';
import auth from '../middlewares/auth.js';
import {
    createSePayOrder,
    sePayCallback,
    getOrderPaymentStatus,
    confirmPayment
} from '../controllers/payment.controller.js';
import {
    createVNPayPayment,
    vnpayReturn,
    vnpayIPN
} from '../controllers/vnpay.controller.js';

const paymentRouter = express.Router();

// ===== SePay Routes =====
// Tạo thanh toán SePay (requires auth)
paymentRouter.post('/sepay/create', auth, createSePayOrder);

// Callback từ SePay (public - được SePay gọi)
paymentRouter.post('/sepay/callback', sePayCallback);

// ===== VNPay Routes =====
// Tạo thanh toán VNPay (requires auth)
paymentRouter.post('/vnpay/create', auth, createVNPayPayment);

// Return URL từ VNPay (public - user redirect về)
paymentRouter.get('/vnpay/return', vnpayReturn);

// IPN callback từ VNPay (public - server-to-server)
paymentRouter.get('/vnpay/ipn', vnpayIPN);

// ===== Common Routes =====
// Xác nhận thanh toán từ client (requires auth)
paymentRouter.post('/confirm-payment', auth, confirmPayment);

// Kiểm tra trạng thái theo orderId
paymentRouter.get('/order-status/:orderId', getOrderPaymentStatus);

export default paymentRouter;

