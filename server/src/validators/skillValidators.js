import Joi from "joi";
import { querySchema } from "./commonSchemas.js";

export const SKILL_CATEGORY_OPTIONS = ["Backend", "Frontend", "Database", "Messaging", "DevOps", "Languages", "Tools", "Soft Skills"];
export const SKILL_LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

export const adminSkillQuerySchema = querySchema.keys({
  category: Joi.string().valid(...SKILL_CATEGORY_OPTIONS).allow("").optional(),
});

export const skillSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().valid(...SKILL_CATEGORY_OPTIONS).allow(""),
  level: Joi.string().valid(...SKILL_LEVEL_OPTIONS).allow(""),
  icon: Joi.string().allow(""),
  isPublished: Joi.boolean().default(false),
  displayOrder: Joi.number().integer().min(0).default(0),
});
