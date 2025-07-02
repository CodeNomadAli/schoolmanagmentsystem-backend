import Joi from "joi";

const registerValidation = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must be less than 50 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
  accessLevel: Joi.string().valid("user", "admin","moderator","writer").optional(),
  geographicRegion: Joi.string().optional(),
  isActive: Joi.boolean(),
  emailVerified: Joi.boolean(),
  twoFactorStatus: Joi.string(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  rememberMe: Joi.boolean(),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export { registerValidation, loginValidation };
