import { Router } from "express";

import authRoutes from "./authRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import goalRoutes from "./goalRoutes.js";
import feedRoutes from "./feedRoutes.js";
import profileRoutes from "./profileRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/transactions", transactionRoutes);
router.use("/goals", goalRoutes);
router.use("/feed", feedRoutes);
router.use("/profile", profileRoutes);

export default router;