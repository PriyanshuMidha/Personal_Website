import { Router } from "express";
import createNormalizer from "../../middlewares/normalizeRequest.js";
import validate from "../../middlewares/validate.js";
import { getAdminProfile, updateAdminProfile } from "../../controllers/profileController.js";
import { updateProfileSchema } from "../../validators/profileValidators.js";

const router = Router();
const normalizeProfile = createNormalizer(
  {
    arrayFields: ["highlights", "specialties"],
    booleanFields: ["isPublished"],
    numberFields: ["yearsOfExperience"],
  },
  "body"
);

router.get("/", getAdminProfile);
router.put("/", normalizeProfile, validate(updateProfileSchema), updateAdminProfile);

export default router;
