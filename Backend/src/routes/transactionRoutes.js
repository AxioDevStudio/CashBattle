import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
    create,
    list,
    findById,
    update,
    remove,
    summary
} from "../controllers/transactionController.js";

const router = Router();

router.post("/", authMiddleware, create);

router.get("/", authMiddleware, list);

router.get("/summary", authMiddleware, summary);

router.get("/:id", authMiddleware, findById);

router.put("/:id", authMiddleware, update);

router.delete("/:id", authMiddleware, remove);

export default router;