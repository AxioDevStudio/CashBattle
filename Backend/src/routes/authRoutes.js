import { Router } from "express";

import {
    register,
    login,
    me,
    forgotPassword,
    resetPassword
} from "../controllers/authController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;