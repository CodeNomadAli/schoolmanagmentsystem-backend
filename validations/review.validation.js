// validations/review.validation.js
import Joi from "joi";
import mongoose from "mongoose";

// Utility to check for ObjectId validity
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const reviewValidation = Joi.object({
  userId: Joi.string().custom(objectId).optional(),
  remedyId: Joi.string().custom(objectId).required(),

  effectivenessRating: Joi.number().min(1).max(5).required(),
  easeOfUseRating: Joi.number().min(1).max(5).required(),
  sideEffectsRating: Joi.number().min(1).max(5).required(),
  overallRating: Joi.number().min(1).max(5).required(),

  verifiedPurchase: Joi.boolean().optional(),
  isAnonymous: Joi.boolean().optional(),

  comment: Joi.string().max(1000).optional(),

  moderationStatus: Joi.string()
    .valid("pending", "approved", "rejected")
    .optional(), // usually admin only

  helpfulVotes: Joi.number().min(0).optional(),

  images: Joi.array().items(Joi.string().uri()).optional(),
});


export {
    reviewValidation
}