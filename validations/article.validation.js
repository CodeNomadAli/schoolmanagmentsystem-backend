import Joi from "joi";

// Define allowed media types
const ALLOWED_MEDIA_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

// Base schema
const articleSchema = Joi.object({
  title: Joi.string().max(200).required().messages({
    "string.empty": "Title is required",
    "string.max": "Title must be at most 200 characters",
  }),

  slug: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
    .messages({
      "string.empty": "Slug is required",
      "string.pattern.base": "Slug must be lowercase letters, numbers, and hyphens only",
    }),

  content: Joi.string().required().messages({
    "string.empty": "Content is required",
  }),

  shortDescription: Joi.string().allow("").optional(),

  media: Joi.object({
    type: Joi.string().valid(...ALLOWED_MEDIA_TYPES).optional(),
    source: Joi.string().uri().optional(),
  }).optional(),

  category: Joi.string().allow("").optional(),

  tags: Joi.array()
    .items(
      Joi.string()
        .trim()
        .lowercase()
        .max(50)
    )
    .max(5)
    .optional(),

  author: Joi.string(),

  seo: Joi.object({
    metaTitle: Joi.string().max(60).optional(),
    metaDescription: Joi.string().max(160).optional(),
    keywords: Joi.array().items(Joi.string().max(50)).optional(),
    canonicalUrl: Joi.string().uri().optional(),
  }).optional(),

  status: Joi.string()
    .valid("draft", "review", "published", "archived")
    .optional(),

  moderationStatus: Joi.string()
    .valid("pending", "approved", "rejected")
    .optional(),

  rejectionReason: Joi.string().allow("").optional(),

  publishedAt: Joi.date().optional(),
  lastEditedAt: Joi.date().optional(),

  version: Joi.number().integer().min(1).optional(),
  isFeatured: Joi.boolean().optional(),

  // Views and comments are usually controlled internally, not from client
  viewsCount: Joi.number().integer().min(0).optional(),
  commentsCount: Joi.number().integer().min(0).optional(),
});



export default articleSchema;