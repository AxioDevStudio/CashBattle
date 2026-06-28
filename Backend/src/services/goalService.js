import {
    createGoal,
    listGoals,
    findGoalById,
    updateGoal,
    deleteGoal,
    addGoalProgress
} from "../models/goalModel.js";

export async function createGoalService(userId, data) {
    const { title, targetAmount, category } = data;

    if (!title || !targetAmount) {
        throw new Error("Título e valor alvo são obrigatórios.");
    }

    if (Number(targetAmount) <= 0) {
        throw new Error("O valor alvo deve ser maior que zero.");
    }

    return await createGoal({
        userId,
        title,
        targetAmount: Number(targetAmount),
        category
    });
}

export async function listGoalsService(userId) {
    return await listGoals(userId);
}

export async function findGoalService(userId, goalId) {
    const goal = await findGoalById(userId, goalId);

    if (!goal) {
        throw new Error("Objetivo não encontrado.");
    }

    return goal;
}

export async function updateGoalService(userId, goalId, data) {
    const goal = await updateGoal(userId, goalId, data);

    if (!goal) {
        throw new Error("Objetivo não encontrado.");
    }

    return goal;
}

export async function deleteGoalService(userId, goalId) {
    const goal = await deleteGoal(userId, goalId);

    if (!goal) {
        throw new Error("Objetivo não encontrado.");
    }

    return goal;
}

export async function addGoalProgressService(userId, goalId, amount) {
    if (!amount || Number(amount) <= 0) {
        throw new Error("Informe um valor válido.");
    }

    const goal = await addGoalProgress(userId, goalId, Number(amount));

    if (!goal) {
        throw new Error("Objetivo não encontrado.");
    }

    return goal;
}