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
        email,
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
            email = COALESCE($2, email),
            monthly_income = COALESCE($3, monthly_income),
            other_income = COALESCE($4, other_income),
            monthly_goal = COALESCE($5, monthly_goal),
            goal_category = COALESCE($6, goal_category),
            competition_mode = COALESCE($7, competition_mode)
         WHERE id = $8
         RETURNING id, name, email, avatar_url, xp, level, streak,
                   monthly_income, other_income, monthly_goal,
                   goal_category, competition_mode, created_at`,
        [
            name || null,
            email || null,
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

export async function updatePassword(userId, hashedPassword) {
    const result = await pool.query(
        `UPDATE users
         SET password = $1
         WHERE id = $2
         RETURNING id, name, email`,
        [hashedPassword, userId]
    );

    return result.rows[0];
}