import { Router } from "express";
import multer from "multer";
import path from "path";

import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
    getProfile,
    updateProfileData,
    uploadAvatar,
    deleteAvatar
} from "../controllers/profileController.js";

const router = Router();

const storage = multer.diskStorage({
    destination: "uploads/avatars",
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        const filename = `avatar-${req.userId}-${Date.now()}${ext}`;

        callback(null, filename);
    }
});

const upload = multer({ storage });

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfileData);
router.post("/avatar", authMiddleware, upload.single("avatar"), uploadAvatar);
router.delete("/avatar", authMiddleware, deleteAvatar);

export default router;