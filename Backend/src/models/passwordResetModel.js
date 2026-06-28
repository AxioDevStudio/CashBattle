import pool from "../config/database.js";

export async function createPasswordResetToken({ userId, token }) {
    const result = await pool.query(
        `INSERT INTO password_resets (user_id, token, expires_at)
         VALUES ($1, $2, NOW() + INTERVAL '30 minutes')
         RETURNING *`,
        [userId, token]
    );

    return result.rows[0];
}

export async function findValidPasswordResetToken(token) {
    const result = await pool.query(
        `SELECT *
         FROM password_resets
         WHERE token = $1
           AND used = false
           AND expires_at > NOW()
         LIMIT 1`,
        [token]
    );

    return result.rows[0];
}

export async function markPasswordResetTokenAsUsed(token) {
    const result = await pool.query(
        `UPDATE password_resets
         SET used = true
         WHERE token = $1
         RETURNING *`,
        [token]
    );

    return result.rows[0];
}

export async function deleteOldPasswordResetTokens(userId) {
    await pool.query(
        `DELETE FROM password_resets
         WHERE user_id = $1
            OR expires_at < NOW()
            OR used = true`,
        [userId]
    );
}