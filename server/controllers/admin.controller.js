import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import CouponModel from '../models/coupon.model.js';

/**
 * Lấy tất cả đơn hàng (Admin only)
 * GET /api/admin/orders
 */
export const getAllOrders = async (request, response) => {
    try {
        // Lấy tất cả orders, sort theo thời gian mới nhất
        const orders = await OrderModel.find()
            .populate('userId', 'name email mobile')
            .sort({ createdAt: -1 });

        // Group orders theo orderId (vì 1 order có thể có nhiều products)
        const groupedOrders = orders.reduce((acc, order) => {
            // Lấy base orderId (bỏ suffix -1, -2...)
            const baseOrderId = order.orderId.split('-').slice(0, 3).join('-');
            
            if (!acc[baseOrderId]) {
                acc[baseOrderId] = {
                    orderId: baseOrderId,
                    userId: order.userId?._id || order.userId,
                    userName: order.userId?.name || 'Unknown',
                    userEmail: order.userId?.email || '',
                    userPhone: order.userId?.mobile || '',
                    paymentId: order.paymentId,
                    payment_status: order.payment_status,
                    order_status: order.order_status,
                    refund_status: order.refund_status,
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
            success: true,
            error: false,
            data: orderList,
            count: orderList.length
        });

    } catch (error) {
        console.error('Get all orders error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Cập nhật status đơn hàng (Admin only)
 * PUT /api/admin/orders/:orderId/status
 */
export const updateOrderStatus = async (request, response) => {
    try {
        const { orderId } = request.params;
        const { status } = request.body;

        const validStatuses = ['pending', 'paid', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return response.status(400).json({
                message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`,
                error: true,
                success: false
            });
        }

        // Cập nhật tất cả orders có cùng base orderId
        const result = await OrderModel.updateMany(
            { orderId: { $regex: orderId, $options: 'i' } },
            { $set: { order_status: status } }
        );

        if (result.matchedCount === 0) {
            return response.status(404).json({
                message: 'Order not found',
                error: true,
                success: false
            });
        }

        console.log(`✅ Order ${orderId} status updated to: ${status}`);

        return response.status(200).json({
            success: true,
            error: false,
            message: `Order status updated to ${status}`,
            data: { orderId, status, updated: result.modifiedCount }
        });

    } catch (error) {
        console.error('Update order status error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Lấy thống kê Dashboard (Admin only)
 * GET /api/admin/dashboard-stats
 */
export const getDashboardStats = async (request, response) => {
    try {
        // Đếm số đơn hàng unique (bỏ suffix -1, -2 cho multi-product orders)
        const allOrderIds = await OrderModel.distinct('orderId');
        const uniqueBaseOrderIds = new Set(
            allOrderIds.map(id => id.split('-').slice(0, 3).join('-'))
        );
        const totalOrders = uniqueBaseOrderIds.size;

        const [totalUsers, totalProducts, totalCategories] = await Promise.all([
            UserModel.countDocuments(),
            ProductModel.countDocuments(),
            CategoryModel.countDocuments()
        ]);

        // Lấy recent orders (5 orders mới nhất)
        const recentOrders = await OrderModel.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);

        // Group recent orders
        const groupedRecent = recentOrders.reduce((acc, order) => {
            const baseOrderId = order.orderId.split('-').slice(0, 3).join('-');
            if (!acc[baseOrderId]) {
                acc[baseOrderId] = {
                    orderId: baseOrderId,
                    userName: order.userId?.name || 'Unknown',
                    userEmail: order.userId?.email || '',
                    payment_status: order.payment_status,
                    order_status: order.order_status,
                    totalAmt: order.totalAmt,
                    createdAt: order.createdAt
                };
            }
            return acc;
        }, {});

        return response.status(200).json({
            success: true,
            error: false,
            data: {
                totalUsers,
                totalOrders,
                totalProducts,
                totalCategories,
                recentOrders: Object.values(groupedRecent).slice(0, 5)
            }
        });

    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Lấy chi tiết đơn hàng
 * GET /api/admin/orders/:orderId
 */
export const getOrderDetails = async (request, response) => {
    try {
        const { orderId } = request.params;

        const orders = await OrderModel.find({
            orderId: { $regex: orderId, $options: 'i' }
        }).populate('userId', 'name email mobile');

        if (orders.length === 0) {
            return response.status(404).json({
                message: 'Order not found',
                error: true,
                success: false
            });
        }

        const firstOrder = orders[0];
        const orderData = {
            orderId: orderId,
            userId: firstOrder.userId?._id,
            userName: firstOrder.userId?.name || 'Unknown',
            userEmail: firstOrder.userId?.email || '',
            userPhone: firstOrder.userId?.mobile || '',
            paymentId: firstOrder.paymentId,
            payment_status: firstOrder.payment_status,
            order_status: firstOrder.order_status,
            delivery_address: firstOrder.delivery_address,
            totalAmt: firstOrder.totalAmt,
            createdAt: firstOrder.createdAt,
            products: orders.map(o => ({
                _id: o._id,
                productId: o.productId,
                name: o.product_details?.name || '',
                image: o.product_details?.image?.[0] || '',
                quantity: o.product_details?.quantity || 1,
                price: o.product_details?.price || 0,
                subTotal: o.subTotalAmt
            }))
        };

        return response.status(200).json({
            success: true,
            error: false,
            data: orderData
        });

    } catch (error) {
        console.error('Get order details error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Lấy tất cả users (Admin only)
 * GET /api/admin/users
 */
export const getAllUsers = async (request, response) => {
    try {
        const users = await UserModel.find()
            .select('name email mobile avatar role status createdAt')
            .sort({ createdAt: -1 });

        return response.status(200).json({
            success: true,
            error: false,
            data: users,
            count: users.length
        });

    } catch (error) {
        console.error('Get all users error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Xóa user (Admin only)
 * DELETE /api/admin/users/:userId
 */
export const deleteUser = async (request, response) => {
    try {
        const { userId } = request.params;

        // Không cho xóa chính mình
        if (userId === request.userId) {
            return response.status(400).json({
                message: 'Không thể xóa tài khoản của chính bạn',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findByIdAndDelete(userId);

        if (!user) {
            return response.status(404).json({
                message: 'User không tồn tại',
                error: true,
                success: false
            });
        }

        console.log('✅ User deleted:', userId, user.email);

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Xóa người dùng thành công'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Cập nhật role user (Admin only)
 * PUT /api/admin/users/:userId/role
 */
export const updateUserRole = async (request, response) => {
    try {
        const { userId } = request.params;
        const { role } = request.body;

        const validRoles = ['USER', 'ADMIN'];
        if (!validRoles.includes(role)) {
            return response.status(400).json({
                message: `Role không hợp lệ. Các role hợp lệ: ${validRoles.join(', ')}`,
                error: true,
                success: false
            });
        }

        // Không cho thay đổi role của chính mình
        if (userId === request.userId) {
            return response.status(400).json({
                message: 'Không thể thay đổi role của chính bạn',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('name email role');

        if (!user) {
            return response.status(404).json({
                message: 'User không tồn tại',
                error: true,
                success: false
            });
        }

        console.log('✅ User role updated:', userId, 'to', role);

        return response.status(200).json({
            success: true,
            error: false,
            message: `Đã cập nhật role thành ${role}`,
            data: user
        });

    } catch (error) {
        console.error('Update user role error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Lấy danh sách yêu cầu hủy đơn cần hoàn tiền (Admin only)
 * GET /api/admin/cancellation-requests
 */
export const getCancellationRequests = async (request, response) => {
    try {
        // Lấy tất cả orders có refund_status = 'pending_refund'
        const orders = await OrderModel.find({ refund_status: 'pending_refund' })
            .populate('userId', 'name email mobile')
            .sort({ cancelled_at: -1 });

        // Group orders theo orderId
        const groupedOrders = orders.reduce((acc, order) => {
            const baseOrderId = order.orderId.split('-').slice(0, 3).join('-');
            
            if (!acc[baseOrderId]) {
                acc[baseOrderId] = {
                    orderId: baseOrderId,
                    userId: order.userId?._id || order.userId,
                    userName: order.userId?.name || 'Unknown',
                    userEmail: order.userId?.email || '',
                    userPhone: order.userId?.mobile || '',
                    payment_status: order.payment_status,
                    totalAmt: order.totalAmt,
                    cancel_reason: order.cancel_reason,
                    cancelled_at: order.cancelled_at,
                    refund_status: order.refund_status,
                    refund_info: order.refund_info,
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

        const requestList = Object.values(groupedOrders);

        return response.status(200).json({
            success: true,
            error: false,
            data: requestList,
            count: requestList.length
        });

    } catch (error) {
        console.error('Get cancellation requests error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Đánh dấu đã hoàn tiền (Admin only)
 * PUT /api/admin/mark-refunded/:orderId
 */
export const markAsRefunded = async (request, response) => {
    try {
        const { orderId } = request.params;

        // Cập nhật tất cả orders có cùng base orderId
        const result = await OrderModel.updateMany(
            { orderId: { $regex: orderId, $options: 'i' }, refund_status: 'pending_refund' },
            { $set: { refund_status: 'refunded' } }
        );

        if (result.matchedCount === 0) {
            return response.status(404).json({
                message: 'Không tìm thấy yêu cầu hoàn tiền',
                error: true,
                success: false
            });
        }

        console.log(`✅ Order ${orderId} marked as refunded`);

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Đã đánh dấu hoàn tiền thành công',
            data: { orderId, updated: result.modifiedCount }
        });

    } catch (error) {
        console.error('Mark as refunded error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

// ==================== COUPON MANAGEMENT ====================

/**
 * Lấy tất cả coupons
 * GET /api/admin/coupons
 */
export const getAllCoupons = async (request, response) => {
    try {
        const coupons = await CouponModel.find().sort({ createdAt: -1 });

        return response.status(200).json({
            success: true,
            error: false,
            data: coupons
        });
    } catch (error) {
        console.error('Get all coupons error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Tạo coupon mới
 * POST /api/admin/coupons
 */
export const createCoupon = async (request, response) => {
    try {
        const {
            code,
            description,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscountAmount,
            usageLimit,
            startDate,
            endDate,
            isActive
        } = request.body;

        // Validate required fields
        if (!code || !discountType || !discountValue || !endDate) {
            return response.status(400).json({
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
                error: true,
                success: false
            });
        }

        // Check if code exists
        const existingCoupon = await CouponModel.findOne({ 
            code: code.toUpperCase().trim() 
        });
        if (existingCoupon) {
            return response.status(400).json({
                message: 'Mã giảm giá này đã tồn tại',
                error: true,
                success: false
            });
        }

        const newCoupon = new CouponModel({
            code: code.toUpperCase().trim(),
            description: description || '',
            discountType,
            discountValue,
            minOrderAmount: minOrderAmount || 0,
            maxDiscountAmount: maxDiscountAmount || 0,
            usageLimit: usageLimit || 0,
            startDate: startDate || new Date(),
            endDate,
            isActive: isActive !== false
        });

        await newCoupon.save();

        return response.status(201).json({
            success: true,
            error: false,
            message: 'Tạo mã giảm giá thành công',
            data: newCoupon
        });
    } catch (error) {
        console.error('Create coupon error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Cập nhật coupon
 * PUT /api/admin/coupons/:id
 */
export const updateCoupon = async (request, response) => {
    try {
        const { id } = request.params;
        const updateData = request.body;

        // Nếu update code, check trùng
        if (updateData.code) {
            const existingCoupon = await CouponModel.findOne({ 
                code: updateData.code.toUpperCase().trim(),
                _id: { $ne: id }
            });
            if (existingCoupon) {
                return response.status(400).json({
                    message: 'Mã giảm giá này đã tồn tại',
                    error: true,
                    success: false
                });
            }
            updateData.code = updateData.code.toUpperCase().trim();
        }

        const updatedCoupon = await CouponModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedCoupon) {
            return response.status(404).json({
                message: 'Không tìm thấy mã giảm giá',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Cập nhật mã giảm giá thành công',
            data: updatedCoupon
        });
    } catch (error) {
        console.error('Update coupon error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Xóa coupon
 * DELETE /api/admin/coupons/:id
 */
export const deleteCoupon = async (request, response) => {
    try {
        const { id } = request.params;

        const deletedCoupon = await CouponModel.findByIdAndDelete(id);

        if (!deletedCoupon) {
            return response.status(404).json({
                message: 'Không tìm thấy mã giảm giá',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Xóa mã giảm giá thành công'
        });
    } catch (error) {
        console.error('Delete coupon error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};
