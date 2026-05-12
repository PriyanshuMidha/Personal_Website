import { Router } from "express";
import createNormalizer from "../../middlewares/normalizeRequest.js";
import validate from "../../middlewares/validate.js";
import { createCrudController } from "../../controllers/crudControllerFactory.js";
import { educationService } from "../../services/educationService.js";
import { mongoIdSchema } from "../../validators/commonSchemas.js";
import { adminEducationQuerySchema, educationSchema } from "../../validators/educationValidators.js";

const router = Router();
const controller = createCrudController(educationService, {
  singular: "Education item",
  plural: "Education items",
});
const normalizeEducation = createNormalizer(
  {
    arrayFields: ["coursework"],
    booleanFields: ["isPublished"],
    numberFields: ["startYear", "endYear", "displayOrder"],
  },
  "body"
);

router.get("/", validate(adminEducationQuerySchema, "query"), controller.list);
router.get("/:id", validate(mongoIdSchema, "params"), controller.getById);
router.post("/", normalizeEducation, validate(educationSchema), controller.create);
router.put("/:id", validate(mongoIdSchema, "params"), normalizeEducation, validate(educationSchema), controller.update);
router.delete("/:id", validate(mongoIdSchema, "params"), controller.remove);

export default router;
