import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    create,
    list,
    summary
} from "../controllers/transactionController.js";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, list);
router.get("/summary", authMiddleware, summary);

export default router;