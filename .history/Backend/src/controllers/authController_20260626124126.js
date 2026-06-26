import { registerService, loginService, meService } from "../services/authService.js";

export async function register(req, res) {
    try {
        const result = await registerService(req.body);

        return res.status(201).json({
            message: "Usuário cadastrado com sucesso.",
            ...result
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function login(req, res) {
    try {
        const result = await loginService(req.body);

        return res.status(200).json({
            message: "Login realizado com sucesso.",
            ...result
        });
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
}

export async function me(req, res) {
    try {
        const user = await meService(req.userId);

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}