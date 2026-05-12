import Joi from "joi";
import { fileMetadataSchema } from "./commonSchemas.js";

const socialLinkSchema = Joi.object({
  platform: Joi.string().required(),
  url: Joi.string().uri().required(),
  icon: Joi.string().allow("").optional(),
  displayOrder: Joi.number().integer().min(0).default(0),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().allow(""),
  fullName: Joi.string().allow(""),
  headline: Joi.string().allow(""),
  shortIntro: Joi.string().allow(""),
  subheadline: Joi.string().allow(""),
  bio: Joi.string().allow(""),
  about: Joi.string().allow(""),
  location: Joi.string().allow(""),
  email: Joi.string().email().allow(""),
  phone: Joi.string().allow(""),
  heroDescription: Joi.string().allow(""),
  aboutTitle: Joi.string().allow(""),
  aboutDescription: Joi.string().allow(""),
  yearsOfExperience: Joi.number().min(0).allow(null),
  currentRole: Joi.string().allow(""),
  currentCompany: Joi.string().allow(""),
  githubUrl: Joi.string().uri().allow(""),
  linkedinUrl: Joi.string().uri().allow(""),
  instagramUrl: Joi.string().uri().allow(""),
  profileImageUrl: Joi.string().uri().allow(""),
  resumeUrl: Joi.string().uri().allow(""),
  profileImage: fileMetadataSchema.allow(null).optional(),
  resume: fileMetadataSchema.allow(null).optional(),
  socialLinks: Joi.array().items(socialLinkSchema),
  highlights: Joi.array().items(Joi.string()),
  specialties: Joi.array().items(Joi.string()),
  seoTitle: Joi.string().allow(""),
  seoDescription: Joi.string().allow(""),
  isPublished: Joi.boolean(),
});
