import Joi from "joi";

export const mongoIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow("").optional(),
  sort: Joi.string().allow("").optional(),
});

export const fileMetadataSchema = Joi.object({
  assetId: Joi.string().allow("").optional(),
  publicId: Joi.string().allow("").optional(),
  url: Joi.string().uri().allow("").optional(),
  originalName: Joi.string().allow("").optional(),
  bytes: Joi.number().optional(),
  format: Joi.string().allow("").optional(),
  resourceType: Joi.string().allow("").optional(),
  caption: Joi.string().allow("").optional(),
});

