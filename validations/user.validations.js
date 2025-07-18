
import Joi from "joi";
import mongoose from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");


const createUserSchema = Joi.object({
  username: Joi.string().trim().required(),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(8).required(),
  accessLevel: Joi.string().valid("user", "admin", "moderator", "writer").default("user"),
  geographicRegion: Joi.string().default("global"),
  lastLogin: Joi.date().optional(),
  isActive: Joi.boolean().default(false),
  emailVerified: Joi.boolean().default(true),
  twoFactorStatus: Joi.string().valid("disabled", "pending", "enabled").default("disabled"),
  profileImage: Joi.string().optional().default("/user/default.png"),

  status: Joi.string().valid("active", "suspended", "warning").default("active"),

  suspendedBy: objectId.optional(),
  suspendedMessage: Joi.string().optional(),
  suspendedAt: Joi.date().optional(),

  warningBy: objectId.optional(),
  warningMessage: Joi.string().optional(),
  warningAt: Joi.date().optional(),

  emailVerificationToken: Joi.string().optional(),
  emailVerificationExpires: Joi.date().optional(),
  emailVerificationRequestCount: Joi.number().default(0),
  emailVerificationTimestamp: Joi.date().allow(null).optional(),

  resetPasswordToken: Joi.string().optional(),
  resetPasswordExpires: Joi.date().optional(),
  resetRequestCount: Joi.number().default(0),
  resetRequestTimestamp: Joi.date().allow(null).optional(),
});


const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});


const updateUserSchema = Joi.object({
  username: Joi.string().trim(),
  email: Joi.string().email().trim().lowercase(),
  password: Joi.string().min(8),
  accessLevel: Joi.string().valid("user", "admin", "moderator", "writer"),
  geographicRegion: Joi.string(),
  isActive: Joi.boolean(),
  emailVerified: Joi.boolean().default(true),
  twoFactorStatus: Joi.string().valid("disabled", "pending", "enabled"),
  profileImage: Joi.string().optional(),
  status: Joi.string().valid("active", "suspended", "warning"),
  suspendedBy: objectId.optional(),
  suspendedMessage: Joi.string(),
  suspendedAt: Joi.date(),
  warningBy: objectId.optional(),
  warningMessage: Joi.string(),
  warningAt: Joi.date(),
});

export default {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
};
