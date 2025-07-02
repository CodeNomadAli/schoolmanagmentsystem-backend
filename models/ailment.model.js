import mongoose from "mongoose";

/**
 * Schema for storing information about ailments.
 */
const AilmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3, // Minimum length for the ailment name
        maxlength: 100, // Maximum length for the ailment name
    },
    description: {
        type: String,
        required: true,
        minlength: 10, // Minimum length for the description
        maxlength: 1000, // Maximum length for the description
    },
    symptoms: {
        type: [String],
        default: [],
        validate: {
            validator: (v) => v.length > 0,
            message: 'At least one symptom is required.',
        },
    },
    causesAndRisks: {
        type: [String],
        default: [],
    },
    preventionTips: {
        type: [String],
        default: [],
    },
    recommendedRemedies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Remedy',
    }],
    relatedAilments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ailment',
    }],
    severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'], // Example severity levels
    },
    isContagious: {
        type: Boolean,
        default: false,
    },
    requiresMedicalAttention: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });


AilmentSchema.index({ name: 'text', description: 'text' });

const Ailment = mongoose.model("Ailment", AilmentSchema);
export default Ailment;