import Joi from "joi";

export const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  subject: Joi.string().required(),
  message: Joi.string().min(10).required(),
});

export const updateMessageStatusSchema = Joi.object({
  status: Joi.string().valid("new", "read", "replied", "archived").required(),
});

