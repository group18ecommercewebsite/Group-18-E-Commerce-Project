import CouponModel from '../models/coupon.model.js';
import CouponUsageModel from '../models/couponUsage.model.js';

/**
 * Validate mã coupon
 * POST /coupon/validate
 */
export const validateCouponController = async (request, response) => {
    try {
        const { code, cartTotal } = request.body;
        const userId = request.userId;

        if (!code) {
            return response.status(400).json({
                message: 'Vui lòng nhập mã giảm giá',
                error: true,
                success: false
            });
        }

        // Tìm coupon
        const coupon = await CouponModel.findOne({ 
            code: code.toUpperCase().trim() 
        });

        if (!coupon) {
            return response.status(404).json({
                message: 'Mã giảm giá không tồn tại',
                error: true,
                success: false
            });
        }

        // Kiểm tra trạng thái active
        if (!coupon.isActive) {
            return response.status(400).json({
                message: 'Mã giảm giá đã bị vô hiệu hóa',
                error: true,
                success: false
            });
        }

        // Kiểm tra thời gian hiệu lực
        const now = new Date();
        if (now < coupon.startDate) {
            return response.status(400).json({
                message: 'Mã giảm giá chưa bắt đầu',
                error: true,
                success: false
            });
        }

        if (now > coupon.endDate) {
            return response.status(400).json({
                message: 'Mã giảm giá đã hết hạn',
                error: true,
                success: false
            });
        }

        // Kiểm tra số lần sử dụng tổng
        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
            return response.status(400).json({
                message: 'Mã giảm giá đã hết lượt sử dụng',
                error: true,
                success: false
            });
        }

        // Kiểm tra user đã dùng coupon này chưa (1 user = 1 lần)
        const existingUsage = await CouponUsageModel.findOne({
            couponId: coupon._id,
            userId: userId
        });

        if (existingUsage) {
            return response.status(400).json({
                message: 'Bạn đã sử dụng mã giảm giá này rồi',
                error: true,
                success: false
            });
        }

        // Kiểm tra đơn hàng tối thiểu
        if (coupon.minOrderAmount > 0 && cartTotal < coupon.minOrderAmount) {
            return response.status(400).json({
                message: `Đơn hàng tối thiểu ${coupon.minOrderAmount.toLocaleString('vi-VN')}₫ để sử dụng mã này`,
                error: true,
                success: false
            });
        }

        // Tính số tiền giảm
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
            // Áp dụng giới hạn giảm tối đa
            if (coupon.maxDiscountAmount > 0 && discountAmount > coupon.maxDiscountAmount) {
                discountAmount = coupon.maxDiscountAmount;
            }
        } else {
            // Fixed amount
            discountAmount = coupon.discountValue;
            // Không cho giảm quá tổng đơn
            if (discountAmount > cartTotal) {
                discountAmount = cartTotal;
            }
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: 'Áp dụng mã giảm giá thành công',
            data: {
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discountAmount: discountAmount,
                minOrderAmount: coupon.minOrderAmount,
                maxDiscountAmount: coupon.maxDiscountAmount
            }
        });

    } catch (error) {
        console.error('Validate coupon error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * Tăng usedCount và ghi nhận usage khi áp dụng coupon vào order
 * Internal use - gọi từ order controller
 */
export const recordCouponUsage = async (couponCode, userId, orderId) => {
    try {
        if (!couponCode) return;

        const coupon = await CouponModel.findOne({ 
            code: couponCode.toUpperCase().trim() 
        });

        if (!coupon) return;

        // Tăng usedCount
        await CouponModel.findByIdAndUpdate(coupon._id, {
            $inc: { usedCount: 1 }
        });

        // Ghi nhận usage của user
        await CouponUsageModel.create({
            couponId: coupon._id,
            userId: userId,
            orderId: orderId
        });

        console.log(`✅ Recorded coupon usage: ${couponCode} by user ${userId}`);
    } catch (error) {
        console.error('Record coupon usage error:', error);
    }
};

/**
 * Lấy tất cả coupon đang hoạt động (Public API cho client)
 * GET /coupon/list
 */
export const getActiveCouponsController = async (request, response) => {
    try {
        const now = new Date();

        const coupons = await CouponModel.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now },
            $or: [
                { usageLimit: 0 },
                { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
            ]
        }).select('code description discountType discountValue minOrderAmount maxDiscountAmount endDate');

        return response.status(200).json({
            success: true,
            error: false,
            data: coupons
        });
    } catch (error) {
        console.error('Get active coupons error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};
