import express from "express";
import { getHealth, pingDatabase } from "../controllers/systemController.js";

const router = express.Router();

router.get("/health", getHealth);
router.get("/test/db", pingDatabase);

export default router;
