import Joi from "joi";
import { querySchema } from "./commonSchemas.js";

export const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  subject: Joi.string().required(),
  message: Joi.string().min(10).required(),
});

export const updateMessageStatusSchema = Joi.object({
  status: Joi.string().valid("new", "read", "replied", "archived").required(),
});

export const adminMessageQuerySchema = querySchema.keys({
  status: Joi.string().valid("new", "read", "replied", "archived").allow("").optional(),
});
