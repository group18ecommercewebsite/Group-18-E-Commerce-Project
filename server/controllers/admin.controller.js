import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';

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
