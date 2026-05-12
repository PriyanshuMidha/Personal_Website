import { Router } from "express";
import createNormalizer from "../../middlewares/normalizeRequest.js";
import validate from "../../middlewares/validate.js";
import { createCrudController } from "../../controllers/crudControllerFactory.js";
import { skillService } from "../../services/skillService.js";
import { mongoIdSchema } from "../../validators/commonSchemas.js";
import { adminSkillQuerySchema, skillSchema } from "../../validators/skillValidators.js";

const router = Router();
const controller = createCrudController(skillService, {
  singular: "Skill",
  plural: "Skills",
});
const normalizeSkill = createNormalizer(
  {
    booleanFields: ["isPublished"],
    numberFields: ["displayOrder"],
  },
  "body"
);

router.get("/", validate(adminSkillQuerySchema, "query"), controller.list);
router.get("/:id", validate(mongoIdSchema, "params"), controller.getById);
router.post("/", normalizeSkill, validate(skillSchema), controller.create);
router.put("/:id", validate(mongoIdSchema, "params"), normalizeSkill, validate(skillSchema), controller.update);
router.delete("/:id", validate(mongoIdSchema, "params"), controller.remove);

export default router;
