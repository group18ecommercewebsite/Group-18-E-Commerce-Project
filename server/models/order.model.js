import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    orderId: {
        type: String,
        required: [true, "Provide orderId"],
        unique: false  // Changed: multiple products per order share same orderId
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "product"
    },
    product_details: {
        name: String,
        image: Array,
        quantity: Number,
        price: Number
    },
    paymentId: {
        type: String,
        default: ""
    },
    payment_status: {
        type: String,
        default: ""
    },
    // Changed: Store shipping address as embedded object instead of ObjectId reference
    delivery_address: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        zipCode: String
    },
    subTotalAmt: {
        type: Number,
        default: 0
    },
    totalAmt: {
        type: Number,
        default: 0
    },
    order_status: {
        type: String,
        enum: ['pending', 'paid', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    invoice_receipt: {
        type: String,
        default: ""
    },
    // Cancel order fields
    cancel_reason: {
        type: String,
        default: ""
    },
    cancelled_at: {
        type: Date,
        default: null
    },
    refund_status: {
        type: String,
        enum: ['none', 'pending_refund', 'refunded'],
        default: 'none'
    },
    refund_info: {
        bank_name: { type: String, default: "" },
        account_number: { type: String, default: "" },
        account_holder: { type: String, default: "" }
    }
},
    { timestamps: true }
)

const OrderModel = mongoose.model("order", orderSchema)

export default OrderModel
