import { Router } from "express";
import validate from "../../middlewares/validate.js";
import { login, me } from "../../controllers/authController.js";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { loginSchema } from "../../validators/authValidators.js";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.get("/me", requireAuth, me);

export default router;

