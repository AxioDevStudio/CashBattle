import pool from "../config/database.js";

export async function getUserFeed(userId) {
    const result = await pool.query(
        `SELECT
            t.id,
            t.type,
            CASE
                WHEN t.type = 'income' THEN 'Nova renda registrada'
                WHEN t.type = 'expense' THEN 'Novo gasto registrado'
                WHEN t.type = 'saving' THEN 'Dinheiro guardado'
                ELSE 'Nova atividade'
            END AS title,
            t.amount,
            t.category,
            t.description,
            t.transaction_date AS "transactionDate",
            t.created_at AS "createdAt",
            t.goal_id AS "goalId",
            COALESCE(l.likes_count, 0) AS "likesCount",
            COALESCE(c.comments_count, 0) AS "commentsCount",
            CASE WHEN ul.id IS NULL THEN false ELSE true END AS "likedByMe"
         FROM transactions t
         LEFT JOIN (
            SELECT item_type, item_id, COUNT(*) AS likes_count
            FROM feed_likes
            GROUP BY item_type, item_id
         ) l ON l.item_type = t.type AND l.item_id = t.id
         LEFT JOIN (
            SELECT item_type, item_id, COUNT(*) AS comments_count
            FROM feed_comments
            GROUP BY item_type, item_id
         ) c ON c.item_type = t.type AND c.item_id = t.id
         LEFT JOIN feed_likes ul
            ON ul.item_type = t.type
           AND ul.item_id = t.id
           AND ul.user_id = $1
         WHERE t.user_id = $1
         ORDER BY t.created_at DESC`,
        [userId]
    );

    return result.rows;
}

export async function toggleFeedLike({ userId, itemType, itemId }) {
    const existing = await pool.query(
        `SELECT id
         FROM feed_likes
         WHERE user_id = $1 AND item_type = $2 AND item_id = $3`,
        [userId, itemType, itemId]
    );

    if (existing.rows[0]) {
        await pool.query(
            `DELETE FROM feed_likes
             WHERE user_id = $1 AND item_type = $2 AND item_id = $3`,
            [userId, itemType, itemId]
        );

        return { liked: false };
    }

    await pool.query(
        `INSERT INTO feed_likes (user_id, item_type, item_id)
         VALUES ($1, $2, $3)`,
        [userId, itemType, itemId]
    );

    return { liked: true };
}

export async function createFeedComment({ userId, itemType, itemId, comment }) {
    const result = await pool.query(
        `INSERT INTO feed_comments (user_id, item_type, item_id, comment)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, itemType, itemId, comment]
    );

    return result.rows[0];
}

export async function listFeedComments({ itemType, itemId }) {
    const result = await pool.query(
        `SELECT
            fc.id,
            fc.comment,
            fc.created_at AS "createdAt",
            u.id AS "userId",
            u.name,
            u.avatar_url AS "avatarUrl"
         FROM feed_comments fc
         JOIN users u ON u.id = fc.user_id
         WHERE fc.item_type = $1 AND fc.item_id = $2
         ORDER BY fc.created_at ASC`,
        [itemType, itemId]
    );

    return result.rows;
}