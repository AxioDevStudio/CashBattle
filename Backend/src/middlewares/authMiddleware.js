import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Token não informado." });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
        return res.status(401).json({ error: "Token inválido." });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: "Formato do token inválido." });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "cashbattle_jwt_secret_studio_default_key"
        );

        req.userId = decoded.id;

        return next();
    } catch {
        return res.status(401).json({ error: "Token expirado ou inválido." });
    }
}