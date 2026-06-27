import pool from "../config/database.js";

export async function createGoal({ userId, title, targetAmount, category, deadline, priority }) {
    const result = await pool.query(
        `INSERT INTO goals (
            user_id, title, target_amount, category, deadline, priority
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
            userId,
            title,
            targetAmount,
            category || null,
            deadline || null,
            priority || "medium"
        ]
    );

    return result.rows[0];
}

export async function listGoals(userId) {
    const result = await pool.query(
        `SELECT *
         FROM goals
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );

    return result.rows;
}

export async function updateGoalProgress({ userId, goalId, amount }) {
    const result = await pool.query(
        `UPDATE goals
         SET current_amount = current_amount + $1
         WHERE id = $2 AND user_id = $3
         RETURNING *`,
        [amount, goalId, userId]
    );

    return result.rows[0];
}