import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
    create,
    list,
    findById,
    update,
    remove,
    addProgress
} from "../controllers/goalController.js";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, list);
router.get("/:id", authMiddleware, findById);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);
router.patch("/:id/progress", authMiddleware, addProgress);

export default router;