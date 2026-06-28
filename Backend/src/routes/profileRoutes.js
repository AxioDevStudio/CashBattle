import { Router } from "express";
import multer from "multer";
import path from "path";

import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
    getProfile,
    updateProfileData,
    uploadAvatar,
    deleteAvatar,
    changePassword
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

const fileFilter = (req, file, callback) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (allowed.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error("Formato de imagem inválido."));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfileData);
router.post("/avatar", authMiddleware, upload.single("avatar"), uploadAvatar);
router.delete("/avatar", authMiddleware, deleteAvatar);
router.put("/password", authMiddleware, changePassword);

export default router;