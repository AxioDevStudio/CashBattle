import { Router } from "express";

import authRoutes from "./authRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import goalRoutes from "./goalRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/transactions", transactionRoutes);
router.use("/goals", goalRoutes);

export default router;