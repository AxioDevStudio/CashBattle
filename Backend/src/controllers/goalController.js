import {
    createGoalService,
    listGoalsService,
    findGoalService,
    updateGoalService,
    deleteGoalService,
    addGoalProgressService
} from "../services/goalService.js";

export async function create(req, res) {
    try {
        const goal = await createGoalService(req.userId, req.body);

        return res.status(201).json({
            message: "Objetivo criado com sucesso.",
            goal
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

export async function list(req, res) {
    try {
        const goals = await listGoalsService(req.userId);

        return res.json({ goals });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

export async function findById(req, res) {
    try {
        const goal = await findGoalService(req.userId, req.params.id);

        return res.json({ goal });
    } catch (error) {
        return res.status(404).json({
            error: error.message
        });
    }
}

export async function update(req, res) {
    try {
        const goal = await updateGoalService(
            req.userId,
            req.params.id,
            req.body
        );

        return res.json({
            message: "Objetivo atualizado com sucesso.",
            goal
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

export async function remove(req, res) {
    try {
        const goal = await deleteGoalService(req.userId, req.params.id);

        return res.json({
            message: "Objetivo removido com sucesso.",
            goal
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

export async function addProgress(req, res) {
    try {
        const goal = await addGoalProgressService(
            req.userId,
            req.params.id,
            req.body.amount
        );

        return res.json({
            message: "Valor adicionado ao objetivo.",
            goal
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}