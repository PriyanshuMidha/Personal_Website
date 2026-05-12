import { Router } from "express";
import createNormalizer from "../../middlewares/normalizeRequest.js";
import validate from "../../middlewares/validate.js";
import { createCrudController } from "../../controllers/crudControllerFactory.js";
import { projectService } from "../../services/projectService.js";
import { mongoIdSchema } from "../../validators/commonSchemas.js";
import { adminProjectQuerySchema, projectSchema } from "../../validators/projectValidators.js";

const router = Router();
const controller = createCrudController(projectService, {
  singular: "Project",
  plural: "Projects",
});
const normalizeProject = createNormalizer(
  {
    arrayFields: ["techStack", "features"],
    booleanFields: ["isFeatured", "isPublished"],
    numberFields: ["displayOrder"],
  },
  "body"
);

router.get("/", validate(adminProjectQuerySchema, "query"), controller.list);
router.get("/:id", validate(mongoIdSchema, "params"), controller.getById);
router.post("/", normalizeProject, validate(projectSchema), controller.create);
router.put("/:id", validate(mongoIdSchema, "params"), normalizeProject, validate(projectSchema), controller.update);
router.delete("/:id", validate(mongoIdSchema, "params"), controller.remove);

export default router;
