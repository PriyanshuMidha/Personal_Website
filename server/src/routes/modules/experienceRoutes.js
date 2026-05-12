import { Router } from "express";
import createNormalizer from "../../middlewares/normalizeRequest.js";
import validate from "../../middlewares/validate.js";
import { createCrudController } from "../../controllers/crudControllerFactory.js";
import { experienceService } from "../../services/experienceService.js";
import { mongoIdSchema } from "../../validators/commonSchemas.js";
import { adminExperienceQuerySchema, experienceSchema } from "../../validators/experienceValidators.js";

const router = Router();
const controller = createCrudController(experienceService, {
  singular: "Experience",
  plural: "Experience",
});
const normalizeExperience = createNormalizer(
  {
    arrayFields: ["responsibilities", "achievements", "techStack"],
    booleanFields: ["isCurrent", "isPublished"],
    numberFields: ["displayOrder"],
    dateFields: ["startDate", "endDate"],
  },
  "body"
);

router.get("/", validate(adminExperienceQuerySchema, "query"), controller.list);
router.get("/:id", validate(mongoIdSchema, "params"), controller.getById);
router.post("/", normalizeExperience, validate(experienceSchema), controller.create);
router.put("/:id", validate(mongoIdSchema, "params"), normalizeExperience, validate(experienceSchema), controller.update);
router.delete("/:id", validate(mongoIdSchema, "params"), controller.remove);

export default router;
