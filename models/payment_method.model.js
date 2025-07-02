import mongoose from "mongoose";

const PaymentMethodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tokenizedCard: {
        type: String,
        required: true, 
    },
    provider: {
        type: String,
        enum: ['Visa', 'MasterCard', 'American Express', 'Discover'],// maybe update this in future
        required: true,
    },
    lastFourDigits: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\d{4}/.test(v); // Ensure it is 4 digits
            },
            message: props => `${props.value} is not a valid last four digits!`
        }
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    billingAddress: {
        type: String,
        required: true,
    },
    cardholderName: {
        type: String,
        required: true,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const PaymentMethod = mongoose.model("PaymentMethod", PaymentMethodSchema);

export default PaymentMethod;