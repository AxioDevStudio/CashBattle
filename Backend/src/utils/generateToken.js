import jwt from "jsonwebtoken";

export function generateToken(userId) {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || "cashbattle_jwt_secret_studio_default_key",
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
}