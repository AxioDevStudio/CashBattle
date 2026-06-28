import pool from "../config/database.js";

export async function getProfileById(userId) {
    const result = await pool.query(
        `SELECT id, name, email, avatar_url, xp, level, streak,
                monthly_income, other_income, monthly_goal,
                goal_category, competition_mode, created_at
         FROM users
         WHERE id = $1`,
        [userId]
    );

    return result.rows[0];
}

export async function updateProfile(userId, data) {
    const {
        name,
        monthlyIncome,
        otherIncome,
        monthlyGoal,
        goalCategory,
        competitionMode
    } = data;

    const result = await pool.query(
        `UPDATE users
         SET
            name = COALESCE($1, name),
            monthly_income = COALESCE($2, monthly_income),
            other_income = COALESCE($3, other_income),
            monthly_goal = COALESCE($4, monthly_goal),
            goal_category = COALESCE($5, goal_category),
            competition_mode = COALESCE($6, competition_mode)
         WHERE id = $7
         RETURNING id, name, email, avatar_url, xp, level, streak,
                   monthly_income, other_income, monthly_goal,
                   goal_category, competition_mode, created_at`,
        [
            name || null,
            monthlyIncome || null,
            otherIncome || null,
            monthlyGoal || null,
            goalCategory || null,
            competitionMode || null,
            userId
        ]
    );

    return result.rows[0];
}

export async function updateAvatar(userId, avatarUrl) {
    const result = await pool.query(
        `UPDATE users
         SET avatar_url = $1
         WHERE id = $2
         RETURNING id, name, email, avatar_url`,
        [avatarUrl, userId]
    );

    return result.rows[0];
}

export async function removeAvatar(userId) {
    const result = await pool.query(
        `UPDATE users
         SET avatar_url = NULL
         WHERE id = $1
         RETURNING id, name, email, avatar_url`,
        [userId]
    );

    return result.rows[0];
}