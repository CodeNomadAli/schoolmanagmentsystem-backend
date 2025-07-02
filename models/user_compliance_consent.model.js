import mongoose from "mongoose";

const UserComplianceConsentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gdprConsent: {
      type: Boolean,
      required: true,
    },
    marketingConsent: {
      type: Boolean,
      required: true,
    },
    aiRemedyConsent: {
      type: Boolean,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    consentHistory: [
      {
        consentType: {
          type: String,
          enum: ["gdpr", "marketing", "aiRemedy"], // maybe update this in future
          required: true,
        },
        consentGiven: {
          type: Boolean,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    dataProcessingPurpose: {
      type: String,
      required: true,
    },
    consentVersion: {
      type: String,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const UserComplianceConsent = mongoose.model(
  "UserComplianceConsent",
  UserComplianceConsentSchema
);

export default UserComplianceConsent;
