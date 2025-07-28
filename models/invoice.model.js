import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planId: {
  type: String, // Stripe price ID
  required: true
}
,
  planName: { type: String, required: false },
  subscriptionType: { type: String },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
}, {
  timestamps: true
});

export default mongoose.model("Invoice", invoiceSchema);
