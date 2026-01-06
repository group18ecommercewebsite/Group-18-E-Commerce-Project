import crypto from 'crypto';
import querystring from 'qs';
import OrderModel from '../models/order.model.js';
import CartProductModel from '../models/cartproduct.model.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';
import { recordCouponUsage } from './coupon.controller.js';

// VNPay Config
const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
const vnp_Url = process.env.VNPAY_URL;
const vnp_ReturnUrl = process.env.VNPAY_RETURN_URL;

// Generate unique order ID
const generateOrderId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
};

// Sort object theo alphabet (yêu cầu của VNPay)
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

// Format date theo yêu cầu VNPay: yyyyMMddHHmmss
function formatVNPayDate(date) {
    const pad = (n) => n < 10 ? '0' + n : n;
    return date.getFullYear().toString() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds());
}

/**
 * Tạo URL thanh toán VNPay
 * POST /api/payment/vnpay/create
 */
export const createVNPayPayment = async (request, response) => {
    try {
        const userId = request.userId;
        const { products, shippingAddress, totalAmount, subTotalAmount, couponCode, discountAmount } = request.body;
        const ipAddr = request.headers['x-forwarded-for'] || 
                       request.connection?.remoteAddress || 
                       request.socket?.remoteAddress ||
                       '127.0.0.1';

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
        const amountVND = Math.round(totalAmount);

        // ===== TẠO ORDER VÀO DATABASE với status "Pending Payment" =====
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
                paymentId: orderId,
                payment_status: 'Pending Payment via VNPay',
                delivery_address: shippingAddress,
                subTotalAmt: product.price * product.quantity,
                totalAmt: totalAmount,
                order_status: 'pending',
                couponCode: couponCode || '',
                discountAmount: discountAmount || 0
            });

            const savedOrder = await order.save();
            orders.push(savedOrder);
        }

        // Clear cart
        await CartProductModel.deleteMany({ userId: userId });
        await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });

        console.log('📦 VNPay Orders created:', orderId);

        // Tạo VNPay payment URL
        const createDate = formatVNPayDate(new Date());
        const expireDate = formatVNPayDate(new Date(Date.now() + 15 * 60 * 1000)); // 15 phút

        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = vnp_TmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = `Thanh toan don hang ${orderId}`;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amountVND * 100; // VNPay yêu cầu nhân 100
        vnp_Params['vnp_ReturnUrl'] = vnp_ReturnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        vnp_Params['vnp_ExpireDate'] = expireDate;

        vnp_Params = sortObject(vnp_Params);

        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;

        const paymentUrl = vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });

        console.log('💳 VNPay payment URL created:', paymentUrl);

        return response.status(200).json({
            success: true,
            error: false,
            message: "VNPay payment URL created",
            data: {
                orderId,
                paymentUrl,
                amount: amountVND
            }
        });

    } catch (error) {
        console.error('❌ VNPay create payment error:', error);
        return response.status(500).json({
            message: error.message || 'Internal server error',
            error: true,
            success: false
        });
    }
};

/**
 * VNPay Return URL - Xử lý khi user quay về từ VNPay
 * GET /api/payment/vnpay/return
 */
export const vnpayReturn = async (request, response) => {
    try {
        let vnp_Params = request.query;
        const secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        const orderId = vnp_Params['vnp_TxnRef'];
        const responseCode = vnp_Params['vnp_ResponseCode'];
        const transactionNo = vnp_Params['vnp_TransactionNo'];
        const amount = parseInt(vnp_Params['vnp_Amount']) / 100;

        console.log('📩 VNPay return:', { orderId, responseCode, transactionNo, amount });

        if (secureHash === signed) {
            if (responseCode === '00') {
                // Thanh toán thành công
                const orders = await OrderModel.find({ 
                    orderId: { $regex: orderId, $options: 'i' } 
                });

                if (orders.length > 0 && !orders[0].payment_status?.includes('Paid')) {
                    await OrderModel.updateMany(
                        { orderId: { $regex: orderId, $options: 'i' } },
                        { 
                            $set: { 
                                payment_status: 'Paid via VNPay',
                                order_status: 'paid',
                                paymentId: transactionNo || orderId
                            } 
                        }
                    );

                    // Giảm kho
                    for (const order of orders) {
                        const quantity = order.product_details?.quantity || 1;
                        await ProductModel.findByIdAndUpdate(
                            order.productId,
                            { $inc: { countInStock: -quantity } }
                        );
                    }

                    // Record coupon usage
                    const firstOrder = orders[0];
                    if (firstOrder?.couponCode) {
                        await recordCouponUsage(firstOrder.couponCode, firstOrder.userId, orderId);
                    }

                    console.log('✅ VNPay payment success:', orderId);
                }

                return response.status(200).json({
                    success: true,
                    code: '00',
                    message: 'Thanh toán thành công',
                    data: { orderId, transactionNo, amount }
                });
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

                console.log('❌ VNPay payment failed:', orderId, responseCode);

                return response.status(200).json({
                    success: false,
                    code: responseCode,
                    message: 'Thanh toán thất bại',
                    data: { orderId, responseCode }
                });
            }
        } else {
            console.log('⚠️ VNPay invalid signature');
            return response.status(200).json({
                success: false,
                code: '97',
                message: 'Chữ ký không hợp lệ'
            });
        }

    } catch (error) {
        console.error('❌ VNPay return error:', error);
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * VNPay IPN URL - Server-to-server callback
 * POST /api/payment/vnpay/ipn
 */
export const vnpayIPN = async (request, response) => {
    try {
        let vnp_Params = request.query;
        const secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        const orderId = vnp_Params['vnp_TxnRef'];
        const rspCode = vnp_Params['vnp_ResponseCode'];
        const transactionNo = vnp_Params['vnp_TransactionNo'];

        console.log('📩 VNPay IPN:', { orderId, rspCode, transactionNo });

        if (secureHash === signed) {
            const orders = await OrderModel.find({ 
                orderId: { $regex: orderId, $options: 'i' } 
            });

            if (orders.length === 0) {
                return response.status(200).json({ RspCode: '01', Message: 'Order not found' });
            }

            const firstOrder = orders[0];

            // Kiểm tra amount
            const vnpAmount = parseInt(vnp_Params['vnp_Amount']) / 100;
            if (vnpAmount !== firstOrder.totalAmt) {
                return response.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
            }

            // Kiểm tra đã xử lý chưa
            if (firstOrder.payment_status?.includes('Paid')) {
                return response.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
            }

            if (rspCode === '00') {
                await OrderModel.updateMany(
                    { orderId: { $regex: orderId, $options: 'i' } },
                    { 
                        $set: { 
                            payment_status: 'Paid via VNPay',
                            order_status: 'paid',
                            paymentId: transactionNo || orderId
                        } 
                    }
                );

                // Giảm kho
                for (const order of orders) {
                    const quantity = order.product_details?.quantity || 1;
                    await ProductModel.findByIdAndUpdate(
                        order.productId,
                        { $inc: { countInStock: -quantity } }
                    );
                }

                // Record coupon usage
                if (firstOrder?.couponCode) {
                    await recordCouponUsage(firstOrder.couponCode, firstOrder.userId, orderId);
                }

                console.log('✅ VNPay IPN success:', orderId);
                return response.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
            } else {
                await OrderModel.updateMany(
                    { orderId: { $regex: orderId, $options: 'i' } },
                    { 
                        $set: { 
                            payment_status: 'Payment Failed',
                            order_status: 'cancelled'
                        } 
                    }
                );
                return response.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
            }
        } else {
            return response.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
        }

    } catch (error) {
        console.error('❌ VNPay IPN error:', error);
        return response.status(200).json({ RspCode: '99', Message: 'Unknown error' });
    }
};
