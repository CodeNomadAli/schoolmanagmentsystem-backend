import Joi from "joi";

const remedyValidation = Joi.object({
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

  ailments: Joi.array()
    .items(
      Joi.string().min(1).required().messages({
        "string.min": "Ailment too short",
        "any.required": "Ailment is required",
        "string.base": "Ailment must be text",
        "string.empty": "Ailment cannot be empty",
      })
    )
    .min(1)
    .required()
    .messages({
      "any.required": "Ailments are required",
      "array.base": "Ailments must be an array of strings",
      "array.min": "At least one ailment is required",
      "array.includesRequiredUnknowns": "Each ailment must be a valid string",
    }),

  ingredients: Joi.array()
    .items(
      Joi.string().trim().messages({
        "string.base": "Each ingredient must be text",
        "string.empty": "Ingredient cannot be empty",
      })
    )
    .optional()
    .messages({
      "array.base": "Ingredients must be an array",
    }),

  usageInstructions: Joi.string().trim().required().messages({
    "any.required": "Usage Instructions are required",
    "string.empty": "Usage Instructions cannot be empty",
    "string.base": "Usage Instructions must be text",
  }),

  preparationMethod: Joi.string().trim().empty("").min(5).optional().messages({
    "string.min": "Preparation Method too short",
    "string.base": "Preparation Method must be text",
    "string.empty": "Preparation Method cannot be empty",
  }),

  preparationTime: Joi.string().trim().empty("").optional().messages({
    "string.base": "Preparation Time must be text",
    "string.empty": "Preparation Time cannot be empty",
  }),

  brandName: Joi.string().trim().empty("").optional().messages({
    "string.base": "Brand Name must be text",
    "string.empty": "Brand Name cannot be empty",
  }),

  content: Joi.string().trim().empty("").optional().messages({
    "string.base": "Content must be text",
    "string.empty": "Content cannot be empty",
  }),

  equipments: Joi.string().trim().empty("").optional().messages({
    "string.base": "Equipments must be text",
    "string.empty": "Equipments cannot be empty",
  }),

  howToTakeIt: Joi.string().trim().empty("").optional().messages({
    "string.base": "How To Take It must be text",
    "string.empty": "How To Take It cannot be empty",
  }),

  dosageAndUsage: Joi.string().trim().empty("").optional().messages({
    "string.base": "Dosage And Usage must be text",
    "string.empty": "Dosage And Usage cannot be empty",
  }),

  storageInstructions: Joi.string().trim().empty("").optional().messages({
    "string.base": "Storage Instructions must be text",
    "string.empty": "Storage Instructions cannot be empty",
  }),

  sideEffects: Joi.array()
    .items(
      Joi.string().trim().empty("").messages({
        "string.base": "Side effect must be text",
        "string.empty": "Side effect cannot be empty",
      })
    )
    .optional()
    .messages({
      "array.base": "Side Effects must be an array of strings",
    }),

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
        "string.uri": "Scientific Reference must be a valid URL",
        "string.base": "Scientific Reference must be text",
      })
    )
    .default([])
    .messages({
      "array.base": "Scientific References must be an array",
    }),

  geographicRestrictions: Joi.array()
    .items(
      Joi.string().trim().empty("").messages({
        "string.base": "Geographic Restriction must be text",
        "string.empty": "Geographic Restriction cannot be empty",
      })
    )
    .default([])
    .messages({
      "array.base": "Geographic Restrictions must be an array of strings",
    }),

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

  relatedQuestions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().trim().empty("").optional().messages({
          "string.base": "Related question must be text",
          "string.empty": "Related question cannot be empty",
        }),
        answer: Joi.string().trim().empty("").optional().messages({
          "string.base": "Related answer must be text",
          "string.empty": "Related answer cannot be empty",
        }),
      })
    )
    .optional()
    .messages({
      "array.base": "Related Questions must be an array",
    }),

  answers: Joi.array()
    .items(
      Joi.string().trim().empty("").messages({
        "string.base": "Answer must be text",
        "string.empty": "Answer cannot be empty",
      })
    )
    .optional()
    .messages({
      "array.base": "Answers must be an array",
    }),

  answeredQuestions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().trim().optional().messages({
          "string.base": "Answered question must be text",
          "string.empty": "Answered question cannot be empty",
        }),
        answer: Joi.string().trim().optional().messages({
          "string.base": "Answered answer must be text",
          "string.empty": "Answered answer cannot be empty",
        }),
        is_required: Joi.boolean().optional().messages({
          "boolean.base": "is_required must be true or false",
        }),
      })
    )
    .optional()
    .messages({
      "array.base": "Answered Questions must be an array",
    }),

  isPublic: Joi.boolean().default(false).messages({
    "boolean.base": "Is Public must be true or false",
  }),

  whyItWorks: Joi.string().trim().empty("").optional().messages({
    "string.base": "Why It Works must be text",
    "string.empty": "Why It Works cannot be empty",
  }),
});

export { remedyValidation };
