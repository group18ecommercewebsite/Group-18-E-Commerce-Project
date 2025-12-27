import OrderModel from "../models/order.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import mongoose from "mongoose";

// Generate unique order ID
function generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
}

// Create order (Cash on Delivery)
export const createOrderController = async (request, response) => {
    try {
        const userId = request.userId; // From auth middleware

        const {
            products,
            shippingAddress,
            totalAmount,
            subTotalAmount
        } = request.body;

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

        // Create orders for each product
        const baseOrderId = generateOrderId();
        const orders = [];

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            // Each order gets unique orderId by appending product index
            const uniqueOrderId = products.length > 1 ? `${baseOrderId}-${i + 1}` : baseOrderId;
            
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
                paymentId: "COD",
                payment_status: "Cash On Delivery",
                delivery_address: shippingAddress,
                subTotalAmt: product.price * product.quantity,
                totalAmt: totalAmount
            });

            const savedOrder = await order.save();
            orders.push(savedOrder);

            // Giảm số lượng sản phẩm trong kho
            await ProductModel.findByIdAndUpdate(
                product.productId,
                { $inc: { countInStock: -product.quantity } }
            );
        }

        // Clear cart after successful order
        await CartProductModel.deleteMany({ userId: userId });

        // Update user's shopping cart reference
        await UserModel.findByIdAndUpdate(userId, {
            shopping_cart: []
        });

        return response.status(201).json({
            message: "Order placed successfully!",
            error: false,
            success: true,
            data: {
                orderId: baseOrderId,
                orders: orders
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Get user's orders
export const getMyOrdersController = async (request, response) => {
    try {
        const userId = request.userId;

        // Get all orders grouped by orderId
        const orders = await OrderModel.find({ userId: userId })
            .sort({ createdAt: -1 });

        // Group orders by base orderId (bỏ suffix -1, -2, -3...)
        const groupedOrders = orders.reduce((acc, order) => {
            // Lấy base orderId: ORD-XXXXXX-YYYY (bỏ phần -1, -2 ở cuối)
            const baseOrderId = order.orderId.split('-').slice(0, 3).join('-');
            
            if (!acc[baseOrderId]) {
                acc[baseOrderId] = {
                    orderId: baseOrderId,
                    paymentId: order.paymentId,
                    payment_status: order.payment_status,
                    order_status: order.order_status,
                    delivery_address: order.delivery_address,
                    totalAmt: order.totalAmt,
                    createdAt: order.createdAt,
                    products: []
                };
            }
            acc[baseOrderId].products.push({
                _id: order._id,
                productId: order.productId,
                name: order.product_details?.name || '',
                image: order.product_details?.image?.[0] || '',
                quantity: order.product_details?.quantity || 1,
                price: order.product_details?.price || 0,
                subTotal: order.subTotalAmt
            });
            return acc;
        }, {});

        const orderList = Object.values(groupedOrders);

        return response.status(200).json({
            error: false,
            success: true,
            data: orderList
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Get order by ID
export const getOrderByIdController = async (request, response) => {
    try {
        const userId = request.userId;
        const { orderId } = request.params;

        const orders = await OrderModel.find({
            userId: userId,
            orderId: orderId
        });

        if (!orders || orders.length === 0) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        // Group into single order object
        const orderData = {
            orderId: orders[0].orderId,
            paymentId: orders[0].paymentId,
            payment_status: orders[0].payment_status,
            delivery_address: orders[0].delivery_address,
            totalAmt: orders[0].totalAmt,
            createdAt: orders[0].createdAt,
            products: orders.map(order => ({
                _id: order._id,
                productId: order.productId,
                name: order.product_details?.name || '',
                image: order.product_details?.image?.[0] || '',
                quantity: order.product_details?.quantity || 1,
                price: order.product_details?.price || 0,
                subTotal: order.subTotalAmt
            }))
        };

        return response.status(200).json({
            error: false,
            success: true,
            data: orderData
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
