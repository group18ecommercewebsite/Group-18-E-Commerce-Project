import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Mã coupon là bắt buộc'],
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: [true, 'Loại giảm giá là bắt buộc']
    },
    discountValue: {
        type: Number,
        required: [true, 'Giá trị giảm là bắt buộc'],
        min: 0
    },
    minOrderAmount: {
        type: Number,
        default: 0  // 0 = không giới hạn
    },
    maxDiscountAmount: {
        type: Number,
        default: 0  // 0 = không giới hạn (chỉ áp dụng cho percentage)
    },
    usageLimit: {
        type: Number,
        default: 0  // 0 = vô hạn
    },
    usedCount: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: [true, 'Ngày hết hạn là bắt buộc']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index cho tìm kiếm nhanh
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

const CouponModel = mongoose.model('Coupon', couponSchema);

export default CouponModel;
