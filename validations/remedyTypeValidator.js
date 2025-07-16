import Joi from "joi";

export const remedyTypeSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().allow(""),
  isActive: Joi.boolean().default(true),

  elements: Joi.array().items(
    Joi.object({
      field: Joi.string().required(),
      fieldType: Joi.string()
        .valid("input", "textarea", "radio", "checkbox", "list", "dropdown", "image", "video")
        .required(),
      label: Joi.string().allow(""),
      options: Joi.array().items(Joi.string()).default([]),
      required: Joi.boolean().default(false),
    })
  ).default([]),

});
