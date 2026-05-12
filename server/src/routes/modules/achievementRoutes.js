import { Router } from "express";
import createNormalizer from "../../middlewares/normalizeRequest.js";
import validate from "../../middlewares/validate.js";
import { createCrudController } from "../../controllers/crudControllerFactory.js";
import { achievementService } from "../../services/achievementService.js";
import { mongoIdSchema } from "../../validators/commonSchemas.js";
import { achievementSchema, adminAchievementQuerySchema } from "../../validators/achievementValidators.js";

const router = Router();
const controller = createCrudController(achievementService, {
  singular: "Achievement",
  plural: "Achievements",
});
const normalizeAchievement = createNormalizer(
  {
    booleanFields: ["isFeatured", "isPublished"],
    numberFields: ["displayOrder"],
    dateFields: ["date"],
  },
  "body"
);

router.get("/", validate(adminAchievementQuerySchema, "query"), controller.list);
router.get("/:id", validate(mongoIdSchema, "params"), controller.getById);
router.post("/", normalizeAchievement, validate(achievementSchema), controller.create);
router.put("/:id", validate(mongoIdSchema, "params"), normalizeAchievement, validate(achievementSchema), controller.update);
router.delete("/:id", validate(mongoIdSchema, "params"), controller.remove);

export default router;
