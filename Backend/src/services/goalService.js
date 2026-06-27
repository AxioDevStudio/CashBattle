import { createGoal, listGoals, updateGoalProgress } from "../models/goalModel.js";

export async function createGoalService(userId, data) {
    const { title, targetAmount, category, deadline, priority } = data;

    if (!title || !targetAmount) {
        throw new Error("Título e valor da meta são obrigatórios.");
    }

    return await createGoal({
        userId,
        title,
        targetAmount: Number(targetAmount),
        category,
        deadline,
        priority
    });
}

export async function listGoalsService(userId) {
    return await listGoals(userId);
}

export async function updateGoalProgressService(userId, goalId, amount) {
    if (!amount || Number(amount) <= 0) {
        throw new Error("Informe um valor válido.");
    }

    return await updateGoalProgress({
        userId,
        goalId,
        amount: Number(amount)
    });
}