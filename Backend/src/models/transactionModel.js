import pool from "../config/database.js";

export async function createTransaction({
    userId,
    type,
    amount,
    category,
    description,
    transactionDate,
    goalId
}) {
    const result = await pool.query(
        `INSERT INTO transactions (
            user_id, type, amount, category, description, transaction_date, goal_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
            userId,
            type,
            amount,
            category || null,
            description || null,
            transactionDate || new Date(),
            goalId || null
        ]
    );

    return result.rows[0];
}

export async function listTransactions(userId) {
    const result = await pool.query(
        `SELECT *
         FROM transactions
         WHERE user_id = $1
         ORDER BY transaction_date DESC, created_at DESC`,
        [userId]
    );

    return result.rows;
}

export async function updateTransaction({ userId, transactionId, type, amount, category, description, transactionDate, goalId }) {
    const result = await pool.query(
        `UPDATE transactions
         SET
            type = COALESCE($1, type),
            amount = COALESCE($2, amount),
            category = COALESCE($3, category),
            description = COALESCE($4, description),
            transaction_date = COALESCE($5, transaction_date),
            goal_id = COALESCE($6, goal_id)
         WHERE id = $7 AND user_id = $8
         RETURNING *`,
        [
            type || null,
            amount || null,
            category || null,
            description || null,
            transactionDate || null,
            goalId || null,
            transactionId,
            userId
        ]
    );

    return result.rows[0];
}

export async function deleteTransaction(userId, transactionId) {
    const result = await pool.query(
        `DELETE FROM transactions
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [transactionId, userId]
    );

    return result.rows[0];
}

export async function getTransactionSummary(userId) {
    const result = await pool.query(
        `SELECT
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense,
            COALESCE(SUM(CASE WHEN type = 'saving' THEN amount ELSE 0 END), 0) AS saving
         FROM transactions
         WHERE user_id = $1`,
        [userId]
    );

    return result.rows[0];
}

export async function findTransactionById(userId, transactionId) {
    const result = await pool.query(
        `SELECT *
         FROM transactions
         WHERE id = $1 AND user_id = $2`,
        [transactionId, userId]
    );

    return result.rows[0];
}