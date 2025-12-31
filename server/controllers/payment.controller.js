import { SePayPgClient } from 'sepay-pg-node';
import OrderModel from '../models/order.model.js';
import CartProductModel from '../models/cartproduct.model.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';
import { recordCouponUsage } from './coupon.controller.js';

// SePay Config
const sepayClient = new SePayPgClient({
    env: process.env.SEPAY_ENV || 'sandbox',
    merchant_id: process.env.SEPAY_MERCHANT_ID,
    secret_key: process.env.SEPAY_SECRET_KEY
});

// Generate unique order ID
const generateOrderId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
};

/**
 * Tạo thanh toán SePay - Tạo order luôn với status "Pending Payment"
 * POST /api/payment/sepay/create
 */
export const createSePayOrder = async (request, response) => {
    try {
        const userId = request.userId;
        const { products, shippingAddress, totalAmount, subTotalAmount, couponCode, discountAmount } = request.body;

        if (!products || products.length === 0) {
            return response.status(400).json({
                message: "No products in order",
                error: true,
                success: false
            });
        }

        if (!shippingAddress) {
            return response.status(400).json({
                message: "Shipping address is required",
                error: true,
                success: false
            });
        }

        const orderId = generateOrderId();
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5174';
        const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 8000}`;

        // Số tiền (SePay dùng VND) - giá đã là VND, không cần chuyển đổi
        const amountVND = Math.round(totalAmount);

        // ===== TẠO ORDER NGAY VÀO DATABASE với status "Pending Payment" =====
        const orders = [];
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const uniqueOrderId = products.length > 1 ? `${orderId}-${i + 1}` : orderId;
            
            const order = new OrderModel({
                userId: userId,
                orderId: uniqueOrderId,
                productId: product.productId,
                product_details: {
                    name: product.name,
                    image: product.image ? [product.image] : [],
                    quantity: product.quantity,
                    price: product.price
                },
                paymentId: orderId, // Sẽ update khi có callback
                payment_status: 'Pending Payment via SePay',
                delivery_address: shippingAddress,
                subTotalAmt: product.price * product.quantity,
                totalAmt: totalAmount,
                order_status: 'pending', // Chờ thanh toán
                couponCode: couponCode || '',
                discountAmount: discountAmount || 0
            });

            const savedOrder = await order.save();
            orders.push(savedOrder);
        }

        // Clear cart SAU KHI tạo order
        await CartProductModel.deleteMany({ userId: userId });
        await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });

        console.log('📦 Orders created with Pending Payment status:', orderId);

        // Tạo payment fields cho SePay
        const paymentFields = sepayClient.checkout.initOneTimePaymentFields({
            operation: 'PURCHASE',
            payment_method: 'BANK_TRANSFER',
            order_invoice_number: orderId,
            order_amount: amountVND,
            currency: 'VND',
            order_description: `HUSTSHOP - Don hang ${orderId}`,
            customer_id: userId,
            success_url: `${clientUrl}/payment-result?orderId=${orderId}&status=success`,
            error_url: `${clientUrl}/payment-result?orderId=${orderId}&status=failed`,
            cancel_url: `${clientUrl}/cart`,
            custom_data: JSON.stringify({ userId, orderId, couponCode })
        });

        const checkoutUrl = sepayClient.checkout.initCheckoutUrl();

        console.log('📦 SePay payment fields:', paymentFields);
        console.log('📦 SePay checkout URL:', checkoutUrl);

        return response.status(200).json({
            success: true,
            error: false,
            message: "SePay payment initialized",
            data: {
                orderId,
                checkout_url: checkoutUrl,
                fields: paymentFields,
                amount: amountVND
            }
        });

    } catch (error) {
        console.error('❌ SePay create order error:', error);
        return response.status(500).json({
            message: error.message || 'Internal server error',
            error: true,
            success: false
        });
    }
};

/**
 * SePay Callback - Cập nhật order status khi thanh toán xong
 * POST /api/payment/sepay/callback
 */
export const sePayCallback = async (request, response) => {
    try {
        const callbackData = request.body;
        console.log('📩 SePay callback received:', callbackData);

        const orderId = callbackData.order_invoice_number;
        const paymentStatus = callbackData.status || callbackData.order_status;

        console.log('✅ SePay callback for:', orderId, 'Status:', paymentStatus);

        // Tìm và update orders trong database
        const orders = await OrderModel.find({ 
            orderId: { $regex: orderId, $options: 'i' } 
        });

        if (orders.length === 0) {
            console.log('⚠️ Orders not found:', orderId);
            return response.json({ code: 'OK', message: 'Order not found' });
        }

        if (paymentStatus === 'COMPLETE' || paymentStatus === 'SUCCESS' || paymentStatus === 'PAID') {
            // Cập nhật tất cả orders liên quan
            await OrderModel.updateMany(
                { orderId: { $regex: orderId, $options: 'i' } },
                { 
                    $set: { 
                        payment_status: 'Paid via SePay',
                        order_status: 'paid',
                        paymentId: callbackData.transaction_id || orderId
                    } 
                }
            );

            // Giảm số lượng sản phẩm trong kho khi thanh toán thành công
            for (const order of orders) {
                const quantity = order.product_details?.quantity || 1;
                await ProductModel.findByIdAndUpdate(
                    order.productId,
                    { $inc: { countInStock: -quantity } }
                );
            }

            // Record coupon usage if coupon was used
            const firstOrder = orders[0];
            if (firstOrder?.couponCode) {
                await recordCouponUsage(firstOrder.couponCode, firstOrder.userId, orderId);
            }

            console.log('✅ Orders updated to PAID and stock reduced:', orderId);
        } else {
            // Thanh toán thất bại
            await OrderModel.updateMany(
                { orderId: { $regex: orderId, $options: 'i' } },
                { 
                    $set: { 
                        payment_status: 'Payment Failed',
                        order_status: 'cancelled'
                    } 
                }
            );
            console.log('❌ Orders marked as FAILED:', orderId);
        }

        return response.json({ code: 'OK', message: 'Callback processed' });

    } catch (error) {
        console.error('❌ SePay callback error:', error);
        return response.status(500).json({ code: 'FAIL', message: error.message });
    }
};

/**
 * Cập nhật order status sau khi thanh toán thành công từ PaymentResult page
 * POST /api/payment/confirm-payment
 */
export const confirmPayment = async (request, response) => {
    try {
        const { orderId } = request.body;

        if (!orderId) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'Order ID is required'
            });
        }

        // Tìm orders trước để giảm kho
        const orders = await OrderModel.find({ 
            orderId: { $regex: orderId, $options: 'i' } 
        });

        if (orders.length === 0) {
            return response.status(404).json({
                success: false,
                error: true,
                message: 'Order not found'
            });
        }

        // Kiểm tra xem đã được xử lý chưa (tránh trừ kho 2 lần)
        const firstOrder = orders[0];
        if (firstOrder.payment_status?.includes('Paid')) {
            console.log('⚠️ Order already paid, skipping stock reduction:', orderId);
            return response.status(200).json({
                success: true,
                error: false,
                message: 'Payment already confirmed',
                data: { orderId, updated: 0 }
            });
        }

        // Cập nhật orders thành Paid
        await OrderModel.updateMany(
            { orderId: { $regex: orderId, $options: 'i' } },
            { 
                $set: { 
                    payment_status: 'Paid via SePay',
                    order_status: 'paid'
                } 
            }
        );

        // Giảm số lượng sản phẩm trong kho
        for (const order of orders) {
            const quantity = order.product_details?.quantity || 1;
            await ProductModel.findByIdAndUpdate(
                order.productId,
                { $inc: { countInStock: -quantity } }
            );
            console.log(`📦 Stock reduced: Product ${order.productId}, Qty: -${quantity}`);
        }

        console.log('✅ Payment confirmed and stock reduced for:', orderId);

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Payment confirmed',
            data: { orderId, updated: orders.length }
        });

    } catch (error) {
        console.error('❌ Confirm payment error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Kiểm tra trạng thái thanh toán theo orderId
 * GET /api/payment/order-status/:orderId
 */
export const getOrderPaymentStatus = async (request, response) => {
    try {
        const { orderId } = request.params;

        // Kiểm tra trong database
        const orders = await OrderModel.find({ 
            orderId: { $regex: orderId, $options: 'i' } 
        });
        
        if (orders.length > 0) {
            const isPaid = orders[0].payment_status?.includes('Paid');
            return response.status(200).json({
                success: true,
                error: false,
                data: {
                    orderId,
                    status: isPaid ? 'success' : 'pending',
                    orders: orders.map(o => ({
                        orderId: o.orderId,
                        status: o.order_status,
                        paymentStatus: o.payment_status
                    }))
                }
            });
        }

        return response.status(404).json({
            success: false,
            error: true,
            message: 'Order not found'
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};
