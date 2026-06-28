import pool from "../config/database.js";

export async function createGoal({ userId, title, targetAmount, category }) {
    const result = await pool.query(
        `INSERT INTO goals (user_id, title, target_amount, current_amount, category)
         VALUES ($1, $2, $3, 0, $4)
         RETURNING *`,
        [userId, title, Number(targetAmount), category || null]
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

export async function findGoalById(userId, goalId) {
    const result = await pool.query(
        `SELECT *
         FROM goals
         WHERE id = $1 AND user_id = $2`,
        [goalId, userId]
    );

    return result.rows[0];
}

export async function updateGoal(userId, goalId, data) {
    const { title, targetAmount, category } = data;

    const result = await pool.query(
        `UPDATE goals
         SET
            title = COALESCE($1, title),
            target_amount = COALESCE($2, target_amount),
            category = COALESCE($3, category)
         WHERE id = $4 AND user_id = $5
         RETURNING *`,
        [
            title || null,
            targetAmount ? Number(targetAmount) : null,
            category || null,
            goalId,
            userId
        ]
    );

    return result.rows[0];
}

export async function deleteGoal(userId, goalId) {
    const result = await pool.query(
        `DELETE FROM goals
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [goalId, userId]
    );

    return result.rows[0];
}

export async function addGoalProgress(userId, goalId, amount) {
    const result = await pool.query(
        `UPDATE goals
         SET current_amount = current_amount + $1
         WHERE id = $2 AND user_id = $3
         RETURNING *`,
        [Number(amount), goalId, userId]
    );

    return result.rows[0];
}

export async function updateGoalProgress({ userId, goalId, amount }) {
    return await addGoalProgress(userId, goalId, amount);
}
