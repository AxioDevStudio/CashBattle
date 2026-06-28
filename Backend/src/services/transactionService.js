import {
    createTransaction,
    listTransactions,
    findTransactionById,
    updateTransaction,
    deleteTransaction,
    getTransactionSummary
} from "../models/transactionModel.js";

import { findUserById } from "../models/userModel.js";
import { updateGoalProgress } from "../models/goalModel.js";

export async function createTransactionService(userId, data) {
    const { type, amount, category, description, transactionDate, goalId } = data;

    if (!type || !amount) {
        throw new Error("Tipo e valor são obrigatórios.");
    }

    if (!["income", "expense", "saving"].includes(type)) {
        throw new Error("Tipo de transação inválido.");
    }

    if (Number(amount) <= 0) {
        throw new Error("O valor deve ser maior que zero.");
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

export async function updateTransactionService(userId, transactionId, data) {
    const { type, amount, category, description, transactionDate, goalId } = data;

    if (type && !["income", "expense", "saving"].includes(type)) {
        throw new Error("Tipo de transação inválido.");
    }

    if (amount && Number(amount) <= 0) {
        throw new Error("O valor deve ser maior que zero.");
    }

    const transaction = await updateTransaction({
        userId,
        transactionId,
        type,
        amount: amount ? Number(amount) : null,
        category,
        description,
        transactionDate,
        goalId
    });

    if (!transaction) {
        throw new Error("Transação não encontrada.");
    }

    return transaction;
}

export async function deleteTransactionService(userId, transactionId) {
    const transaction = await deleteTransaction(userId, transactionId);

    if (!transaction) {
        throw new Error("Transação não encontrada.");
    }

    return transaction;
}

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

export async function findTransactionByIdService(userId, transactionId) {
    const transaction = await findTransactionById(userId, transactionId);

    if (!transaction) {
        throw new Error("Transação não encontrada.");
    }

    return transaction;
}