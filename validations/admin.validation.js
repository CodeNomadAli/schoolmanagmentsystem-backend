import Joi from "joi";

const adminModerateRemedyValidation = Joi.object({
  status: Joi.string().valid("approved", "rejected").required().messages({
    "any.only": "Status must be 'approved' or 'rejected'",
    "string.empty": "Status is required",
  }),
  moderatorNote: Joi.string().allow("").optional(),
  rejectionReason: Joi.string().allow("").optional(),
});

export { adminModerateRemedyValidation };
