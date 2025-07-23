import Joi from "joi";

const remedyValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().min(10).required(),

  category: Joi.string().trim().required(),
  

  ailments: Joi.array().items(Joi.string().min(1).required()).optional(),

  ingredients: Joi.string().trim().optional(),
  usageInstructions: Joi.string().trim().required(),
  preparationMethod: Joi.string().trim().min(5).optional(),
  preparationTime: Joi.string().trim().optional(),
  brandName: Joi.string().trim().optional(),
  content: Joi.string().trim().optional(),

  equipments: Joi.string().trim().optional(),
  howToTakeIt: Joi.string().trim().optional(),
  dosageAndUsage: Joi.string().trim().optional(),
  storageInstructions: Joi.string().trim().optional(),

  sideEffects: Joi.array().items(Joi.string().trim()).optional(),

  aiConfidenceScore: Joi.number().min(0).max(100).default(0),
  isAIGenerated: Joi.boolean().default(false),

  moderationStatus: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending"),

  scientificReferences: Joi.array()
    .items(Joi.string().trim().uri())
    .default([]),

  geographicRestrictions: Joi.array()
    .items(Joi.string().trim())
    .default([]),

  viewCount: Joi.number().min(0).default(0),
  averageRating: Joi.number().min(0).max(5).default(0),
  isActive: Joi.boolean().default(true),

  media: Joi.object({
    type: Joi.string()
      .valid("image/jpeg", "image/jpg", "image/png", "image/gif")
      .optional(),
    source: Joi.string().trim().optional(),
    originalName: Joi.string().trim().optional(),
  }).optional(),

  relatedQuestions: Joi.array().items(
    Joi.object({
      question: Joi.string().trim().optional(),
      answer: Joi.string().trim().optional(),
    })
  ).optional(),

  answers: Joi.array().items(Joi.string().trim()).optional(),

  answeredQuestions: Joi.array().items(
    Joi.object({
      question: Joi.string().trim().optional(),
      answer: Joi.string().trim().optional(),
      is_required: Joi.boolean().optional(),
    })
  ).optional(),

  isPublic: Joi.boolean().default(false),
  whyitworks: Joi.string().trim().optional(),

});
export { remedyValidation };