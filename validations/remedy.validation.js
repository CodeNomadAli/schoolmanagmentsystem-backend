import Joi from "joi";

const remedyValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().min(10).required(),
  category: Joi.string().required(), 
  type: Joi.string().required(),     

  ingredients: Joi.string().optional(),
  preparationMethod: Joi.string().min(5).optional(),
  preparationTime: Joi.string().optional(),
  brandName: Joi.string().optional(),
  instructions: Joi.string().min(5).required(),
  content: Joi.string().optional(),

  equipments: Joi.string().optional(),
  howToTakeIt: Joi.string().optional(),
  dosageAndUsage: Joi.string().optional(),
  storageInstructions: Joi.string().optional(),

  sideEffects: Joi.string().optional(),

  aiConfidenceScore: Joi.number().min(0).max(100).default(0),
  isAIGenerated: Joi.boolean().default(false),

  moderationStatus: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending"),

  scientificReferences: Joi.array()
    .items(Joi.string().uri())
    .default([]),

  geographicRestrictions: Joi.array()
    .items(Joi.string().trim())
    .default([]),

  createdBy: Joi.string().required(), 
  viewCount: Joi.number().min(0).default(0),
  averageRating: Joi.number().min(0).max(5).default(0),
  isActive: Joi.boolean().default(true),

 media: Joi.object({
  type: Joi.string()
    .valid("image/jpeg", "image/jpg", "image/png", "image/gif")
    .optional(),
  source: Joi.string().optional(),
}).optional(),


  
  relatedQuestions: Joi.array().items(
    Joi.object({
      question: Joi.string().optional(),
      answer: Joi.string().optional(),
    })
  ).optional(),

  
  answers: Joi.array().items(Joi.string()).optional(),

  
  answeredQuestions: Joi.array().items(
    Joi.object({
      question: Joi.string().optional(),
      answer: Joi.string().optional(),
      is_required: Joi.boolean().optional(),
    })
  ).optional(),
});

export { remedyValidation };
