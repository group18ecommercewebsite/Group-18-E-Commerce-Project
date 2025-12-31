import mongoose from 'mongoose';

/**
 * Model để track việc sử dụng coupon của mỗi user
 * Đảm bảo 1 user chỉ dùng 1 coupon 1 lần
 */
const couponUsageSchema = new mongoose.Schema({
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    usedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index để đảm bảo 1 user chỉ dùng 1 coupon 1 lần
couponUsageSchema.index({ couponId: 1, userId: 1 }, { unique: true });

const CouponUsageModel = mongoose.model('CouponUsage', couponUsageSchema);

export default CouponUsageModel;
