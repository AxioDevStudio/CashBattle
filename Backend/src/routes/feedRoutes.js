import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
    getFeed,
    toggleLike,
    addComment,
    getComments
} from "../controllers/feedController.js";

const router = Router();

router.get("/", authMiddleware, getFeed);
router.post("/like", authMiddleware, toggleLike);
router.post("/comment", authMiddleware, addComment);
router.get("/:itemType/:itemId/comments", authMiddleware, getComments);

export default router;