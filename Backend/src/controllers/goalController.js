import {
    createGoalService,
    listGoalsService,
    updateGoalProgressService
} from "../services/goalService.js";

export async function create(req, res) {
    try {
        const goal = await createGoalService(req.userId, req.body);

        return res.status(201).json({
            message: "Objetivo criado com sucesso.",
            goal
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function list(req, res) {
    try {
        const goals = await listGoalsService(req.userId);

        return res.json({ goals });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function updateProgress(req, res) {
    try {
        const goal = await updateGoalProgressService(
            req.userId,
            req.params.id,
            req.body.amount
        );

        return res.json({
            message: "Objetivo atualizado.",
            goal
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}