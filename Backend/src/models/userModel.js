import pool from "../config/database.js";

export async function findUserByEmail(email) {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return result.rows[0];
}

export async function findUserById(id) {
    const result = await pool.query(
        `SELECT 
            id,
            name,
            email,
            avatar,
            xp,
            level,
            streak,
            monthly_income,
            other_income,
            monthly_goal,
            goal_category,
            competition_mode,
            created_at
         FROM users 
         WHERE id = $1`,
        [id]
    );

    return result.rows[0];
}

export async function createUser({
    name,
    email,
    password,
    monthlyIncome = 0,
    otherIncome = 0,
    monthlyGoal = 0,
    goalCategory = null,
    competitionMode = "solo"
}) {
    const result = await pool.query(
        `INSERT INTO users (
            name,
            email,
            password,
            monthly_income,
            other_income,
            monthly_goal,
            goal_category,
            competition_mode
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING 
            id,
            name,
            email,
            avatar,
            xp,
            level,
            streak,
            monthly_income,
            other_income,
            monthly_goal,
            goal_category,
            competition_mode,
            created_at`,
        [
            name,
            email,
            password,
            monthlyIncome,
            otherIncome,
            monthlyGoal,
            goalCategory,
            competitionMode
        ]
    );

    return result.rows[0];
}