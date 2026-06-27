import {
    createTransaction,
    listTransactions,
    getTransactionSummary
} from "../models/transactionModel.js";

import { updateGoalProgress } from "../models/goalModel.js";

export async function createTransactionService(userId, data) {
    const { type, amount, category, description, transactionDate, goalId } = data;

    if (!type || !amount) {
        throw new Error("Tipo e valor são obrigatórios.");
    }

    if (!["income", "expense", "saving"].includes(type)) {
        throw new Error("Tipo de transação inválido.");
    }

    const transaction = await createTransaction({
        userId,
        type,
        amount: Number(amount),
        category,
        description,
        transactionDate,
        goalId
    });

    if (type === "saving" && goalId) {
        await updateGoalProgress({
            userId,
            goalId,
            amount: Number(amount)
        });
    }

    return transaction;
}

export async function listTransactionsService(userId) {
    return await listTransactions(userId);
}

import { findUserById } from "../models/userModel.js";

export async function getTransactionSummaryService(userId) {
    const user = await findUserById(userId);
    const summary = await getTransactionSummary(userId);

    const monthlyIncome = Number(user?.monthly_income || 0);
    const otherIncome = Number(user?.other_income || 0);

    const extraIncome = Number(summary.income || 0);
    const expense = Number(summary.expense || 0);
    const saving = Number(summary.saving || 0);

    const income = monthlyIncome + otherIncome + extraIncome;

    return {
        income,
        monthlyIncome,
        otherIncome,
        extraIncome,
        expense,
        saving,
        balance: income - expense - saving
    };
}