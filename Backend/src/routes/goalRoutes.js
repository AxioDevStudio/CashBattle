import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { create, list, updateProgress } from "../controllers/goalController.js";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, list);
router.patch("/:id/progress", authMiddleware, updateProgress);

export default router;