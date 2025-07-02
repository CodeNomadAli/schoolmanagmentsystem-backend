import mongoose from "mongoose";

const PaymentHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSubscription",
        required: true,
    },
    amount: {
        type: Number,
        required: true, 
    },
    currency: {
        type: String,
        required: true, // Currency code (e.g., 'USD', 'EUR')
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],// maybe update this in future
        default: 'pending',
    },
    paymentMethod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentMethod", 
        required: true,
    },
    processedAt: {
        type: Date,
        default: Date.now, 
    },
    transactionId: {
        type: String,
        required: true, 
    },
    receiptUrl: {
        type: String, 
    },
}, { timestamps: true });

const PaymentHistory = mongoose.model("PaymentHistory", PaymentHistorySchema);

export default PaymentHistory;