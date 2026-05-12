import { Router } from "express";
import validate from "../../middlewares/validate.js";
import { listMessages, patchMessageStatus, removeMessage } from "../../controllers/messageController.js";
import { mongoIdSchema } from "../../validators/commonSchemas.js";
import { updateMessageStatusSchema } from "../../validators/contactValidators.js";

const router = Router();

router.get("/", listMessages);
router.patch("/:id", validate(mongoIdSchema, "params"), validate(updateMessageStatusSchema), patchMessageStatus);
router.delete("/:id", validate(mongoIdSchema, "params"), removeMessage);

export default router;

