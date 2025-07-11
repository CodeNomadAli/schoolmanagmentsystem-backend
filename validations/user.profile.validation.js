import Joi from "joi";

const userHealthProfileValidation = Joi.object({
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  age: Joi.number().integer().min(0).optional(),
  sex: Joi.string(),
  weight: Joi.number().min(0).optional(),
  height: Joi.number().min(0).optional(),
  bloodType: Joi.string().optional(),
  allergies: Joi.array().items(Joi.string()).optional(),
  chronicConditions: Joi.array().items(Joi.string()).optional(),
  medications: Joi.array().items(Joi.string()).optional(),
  familyHistory: Joi.array().items(Joi.string()).optional(),
  dataShareConsent: Joi.boolean().optional(),
  preferredLanguage: Joi.string().optional(),
  // for located
  located: Joi.string(),
  ethnicity: Joi.string(),
  birthplace: Joi.string(),
  diet: Joi.string(),
  aiGeneratedFields: Joi.object(),
});

export { userHealthProfileValidation };
