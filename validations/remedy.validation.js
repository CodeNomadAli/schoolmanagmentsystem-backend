import Joi from "joi";

const remedyValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
    "string.min": "Name too short",
    "string.max": "Name too long",
    "string.base": "Name must be text",
  }),

  description: Joi.string().trim().min(10).required().messages({
    "any.required": "Description is required",
    "string.empty": "Description cannot be empty",
    "string.min": "Description too short",
    "string.base": "Description must be text",
  }),

  category: Joi.string().trim().required().messages({
    "any.required": "Category is required",
    "string.empty": "Category cannot be empty",
    "string.base": "Category must be text",
  }),

  ailments: Joi.array().items(
    Joi.string().min(1).required().messages({
      "string.empty": "Ailment cannot be empty",
      "string.min": "Ailment too short",
      "any.required": "Ailment required if provided",
      "string.base": "Ailment must be text",
    })
  ).optional(),

  ingredients: Joi.string().trim().optional().messages({
    "string.base": "Ingredients must be text",
  }),

  usageInstructions: Joi.string().trim().required().messages({
    "any.required": "Usage Instructions are required",
    "string.empty": "Usage Instructions cannot be empty",
    "string.base": "Usage Instructions must be text",
  }),

  preparationMethod: Joi.string().trim().min(5).optional().messages({
    "string.min": "Preparation Method too short",
    "string.base": "Preparation Method must be text",
  }),

  preparationTime: Joi.string().trim().optional().messages({
    "string.base": "Preparation Time must be text",
  }),

  brandName: Joi.string().trim().optional().messages({
    "string.base": "Brand Name must be text",
  }),

  content: Joi.string().trim().optional().messages({
    "string.base": "Content must be text",
  }),

  equipments: Joi.string().trim().optional().messages({
    "string.base": "Equipments must be text",
  }),

  howToTakeIt: Joi.string().trim().optional().messages({
    "string.base": "How To Take It must be text",
  }),

  dosageAndUsage: Joi.string().trim().optional().messages({
    "string.base": "Dosage And Usage must be text",
  }),

  storageInstructions: Joi.string().trim().optional().messages({
    "string.base": "Storage Instructions must be text",
  }),

  sideEffects: Joi.array().items(
    Joi.string().trim().messages({
      "string.base": "Side Effects must be text",
    })
  ).optional(),

  aiConfidenceScore: Joi.number().min(0).max(100).default(0).messages({
    "number.base": "AI Confidence Score must be a number",
    "number.min": "AI Confidence Score cannot be less than 0",
    "number.max": "AI Confidence Score cannot be more than 100",
  }),

  isAIGenerated: Joi.boolean().default(false).messages({
    "boolean.base": "Is AIGenerated must be true or false",
  }),

  moderationStatus: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending")
    .messages({
      "any.only": "Moderation Status must be pending, approved, or rejected",
      "string.base": "Moderation Status must be text",
    }),

  scientificReferences: Joi.array()
    .items(
      Joi.string().trim().uri().messages({
        "string.uri": "Scientific References must be valid URLs",
        "string.base": "Scientific References must be text",
      })
    )
    .default([]),

  geographicRestrictions: Joi.array()
    .items(
      Joi.string().trim().messages({
        "string.base": "Geographic Restrictions must be text",
      })
    )
    .default([]),

  viewCount: Joi.number().min(0).default(0).messages({
    "number.base": "View Count must be a number",
    "number.min": "View Count cannot be negative",
  }),

  averageRating: Joi.number().min(0).max(5).default(0).messages({
    "number.base": "Average Rating must be a number",
    "number.min": "Average Rating cannot be less than 0",
    "number.max": "Average Rating cannot be more than 5",
  }),

  isActive: Joi.boolean().default(false).messages({
    "boolean.base": "Is Active must be true or false",
  }),

  media: Joi.object({
    type: Joi.string()
      .valid("image/jpeg", "image/jpg", "image/png", "image/gif")
      .optional()
      .messages({
        "any.only": "Media type must be jpeg, jpg, png, or gif",
        "string.base": "Media type must be text",
      }),
    source: Joi.string().trim().optional().messages({
      "string.base": "Media source must be text",
    }),
    originalName: Joi.string().trim().optional().messages({
      "string.base": "Media original name must be text",
    }),
  }).optional(),

  relatedQuestions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().trim().optional().messages({
          "string.base": "Related question must be text",
        }),
        answer: Joi.string().trim().optional().messages({
          "string.base": "Related answer must be text",
        }),
      })
    )
    .optional(),

  answers: Joi.array()
    .items(
      Joi.string().trim().messages({
        "string.base": "Answer must be text",
      })
    )
    .optional(),

  answeredQuestions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().trim().optional().messages({
          "string.base": "Answered question must be text",
        }),
        answer: Joi.string().trim().optional().messages({
          "string.base": "Answered answer must be text",
        }),
        is_required: Joi.boolean().optional().messages({
          "boolean.base": "is_required must be true or false",
        }),
      })
    )
    .optional(),

  isPublic: Joi.boolean().default(false).messages({
    "boolean.base": "Is Public must be true or false",
  }),

  whyItWorks: Joi.string().trim().optional().messages({
    "string.base": "Why It Works must be text",
  }),
});

export { remedyValidation };
