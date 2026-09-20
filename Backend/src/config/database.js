import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const hasPgConfig = Boolean(
    (process.env.DB_HOST && process.env.DB_USER) || process.env.DATABASE_URL
);

let realPool = null;
let useMock = !hasPgConfig;

if (hasPgConfig) {
    try {
        realPool = process.env.DATABASE_URL
            ? new Pool({ connectionString: process.env.DATABASE_URL })
            : new Pool({
                  host: process.env.DB_HOST,
                  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
                  database: process.env.DB_NAME,
                  user: process.env.DB_USER,
                  password: process.env.DB_PASSWORD,
              });

        realPool
            .connect()
            .then((client) => {
                console.log("[CashBattle] PostgreSQL conectado com sucesso!");
                client.release();
            })
            .catch((err) => {
                console.warn("[CashBattle] PostgreSQL indisponível, ativando banco in-memory:", err.message);
                useMock = true;
                realPool = null;
            });
    } catch (e) {
        console.warn("[CashBattle] Falha ao instanciar Pool PostgreSQL, ativando mock:", e.message);
        useMock = true;
        realPool = null;
    }
} else {
    console.log("[CashBattle] Nenhuma credencial do PostgreSQL encontrada. Modo in-memory ativo.");
}

// In-memory Database Store
const mem = {
    userIdSeq: 2,
    goalIdSeq: 3,
    txIdSeq: 4,
    commentIdSeq: 1,
    likeIdSeq: 1,
    resetIdSeq: 1,

    users: [
        {
            id: 1,
            name: "Gamer Financeiro",
            email: "demo@cashbattle.com",
            // hashed "123456"
            password: "$2a$10$nWISkigC8dJxv.7KWRXwXOrm5ShaGaPERqUqy/urQdUPUJaYwaG5y",
            avatar: null,
            avatar_url: null,
            xp: 1250,
            level: 3,
            streak: 5,
            monthly_income: 4500,
            other_income: 500,
            monthly_goal: 1000,
            goal_category: "Reserva de Emergência",
            competition_mode: "solo",
            created_at: new Date("2025-01-01T10:00:00Z"),
        },
    ],

    goals: [
        {
            id: 1,
            user_id: 1,
            title: "Reserva de Emergência",
            target_amount: 10000,
            current_amount: 3500,
            category: "Investimentos",
            created_at: new Date("2025-01-05T12:00:00Z"),
        },
        {
            id: 2,
            user_id: 1,
            title: "Viagem de Férias",
            target_amount: 5000,
            current_amount: 1800,
            category: "Lazer",
            created_at: new Date("2025-01-10T15:30:00Z"),
        },
    ],

    transactions: [
        {
            id: 1,
            user_id: 1,
            type: "income",
            amount: 4500,
            category: "Salário",
            description: "Salário mensal",
            transaction_date: new Date(),
            goal_id: null,
            created_at: new Date(Date.now() - 3600000 * 24 * 3),
        },
        {
            id: 2,
            user_id: 1,
            type: "expense",
            amount: 1200,
            category: "Moradia",
            description: "Aluguel e contas",
            transaction_date: new Date(),
            goal_id: null,
            created_at: new Date(Date.now() - 3600000 * 24 * 2),
        },
        {
            id: 3,
            user_id: 1,
            type: "saving",
            amount: 800,
            category: "Investimentos",
            description: "Aporte para reserva",
            transaction_date: new Date(),
            goal_id: 1,
            created_at: new Date(Date.now() - 3600000 * 24),
        },
    ],

    feed_likes: [],
    feed_comments: [],
    password_resets: [],
};

// Helper mock query runner
async function mockQuery(sql, params = []) {
    const cleanSql = sql.replace(/\s+/g, " ").trim();

    // 1. SELECT NOW()
    if (/SELECT NOW\(\)/i.test(cleanSql)) {
        return { rows: [{ now: new Date() }] };
    }

    // 2. USERS
    // findUserByEmail: SELECT * FROM users WHERE email = $1
    if (/FROM users WHERE email =/i.test(cleanSql)) {
        const email = params[0];
        const user = mem.users.find((u) => u.email?.toLowerCase() === email?.toLowerCase());
        return { rows: user ? [{ ...user }] : [] };
    }

    // findUserById / getProfileById: SELECT ... FROM users WHERE id = $1
    if (/FROM users WHERE id =/i.test(cleanSql)) {
        const id = Number(params[0]);
        const user = mem.users.find((u) => u.id === id);
        return { rows: user ? [{ ...user }] : [] };
    }

    // createUser: INSERT INTO users ...
    if (/INSERT INTO users/i.test(cleanSql)) {
        const [
            name,
            email,
            password,
            monthlyIncome = 0,
            otherIncome = 0,
            monthlyGoal = 0,
            goalCategory = null,
            competitionMode = "solo",
        ] = params;

        const newUser = {
            id: mem.userIdSeq++,
            name,
            email,
            password,
            avatar: null,
            avatar_url: null,
            xp: 0,
            level: 1,
            streak: 1,
            monthly_income: Number(monthlyIncome) || 0,
            other_income: Number(otherIncome) || 0,
            monthly_goal: Number(monthlyGoal) || 0,
            goal_category: goalCategory,
            competition_mode: competitionMode,
            created_at: new Date(),
        };

        mem.users.push(newUser);
        return { rows: [{ ...newUser }] };
    }

    // updateUserPassword
    if (/UPDATE users SET password =/i.test(cleanSql)) {
        const [hashedPassword, userId] = params;
        const user = mem.users.find((u) => u.id === Number(userId));
        if (user) {
            user.password = hashedPassword;
            return { rows: [{ id: user.id, name: user.name, email: user.email }] };
        }
        return { rows: [] };
    }

    // updateAvatar
    if (/UPDATE users SET avatar_url = \$1 WHERE id = \$2/i.test(cleanSql)) {
        const [avatarUrl, userId] = params;
        const user = mem.users.find((u) => u.id === Number(userId));
        if (user) {
            user.avatar_url = avatarUrl;
            return { rows: [{ id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url }] };
        }
        return { rows: [] };
    }

    // removeAvatar
    if (/UPDATE users SET avatar_url = NULL WHERE id = \$1/i.test(cleanSql)) {
        const [userId] = params;
        const user = mem.users.find((u) => u.id === Number(userId));
        if (user) {
            user.avatar_url = null;
            return { rows: [{ id: user.id, name: user.name, email: user.email, avatar_url: null }] };
        }
        return { rows: [] };
    }

    // updateProfile
    if (/UPDATE users SET name = COALESCE/i.test(cleanSql)) {
        const [
            name,
            email,
            monthlyIncome,
            otherIncome,
            monthlyGoal,
            goalCategory,
            competitionMode,
            userId,
        ] = params;

        const user = mem.users.find((u) => u.id === Number(userId));
        if (user) {
            if (name !== null) user.name = name;
            if (email !== null) user.email = email;
            if (monthlyIncome !== null) user.monthly_income = Number(monthlyIncome);
            if (otherIncome !== null) user.other_income = Number(otherIncome);
            if (monthlyGoal !== null) user.monthly_goal = Number(monthlyGoal);
            if (goalCategory !== null) user.goal_category = goalCategory;
            if (competitionMode !== null) user.competition_mode = competitionMode;
            return { rows: [{ ...user }] };
        }
        return { rows: [] };
    }

    // 3. GOALS
    // createGoal
    if (/INSERT INTO goals/i.test(cleanSql)) {
        const [userId, title, targetAmount, category] = params;
        const newGoal = {
            id: mem.goalIdSeq++,
            user_id: Number(userId),
            title,
            target_amount: Number(targetAmount),
            current_amount: 0,
            category: category || null,
            created_at: new Date(),
        };
        mem.goals.push(newGoal);
        return { rows: [{ ...newGoal }] };
    }

    // listGoals
    if (/FROM goals WHERE user_id = \$1 ORDER BY created_at DESC/i.test(cleanSql)) {
        const userId = Number(params[0]);
        const userGoals = mem.goals
            .filter((g) => g.user_id === userId)
            .sort((a, b) => b.created_at - a.created_at);
        return { rows: userGoals.map((g) => ({ ...g })) };
    }

    // findGoalById
    if (/FROM goals WHERE id = \$1 AND user_id = \$2/i.test(cleanSql)) {
        const [goalId, userId] = params.map(Number);
        const goal = mem.goals.find((g) => g.id === goalId && g.user_id === userId);
        return { rows: goal ? [{ ...goal }] : [] };
    }

    // updateGoal
    if (/UPDATE goals SET title = COALESCE/i.test(cleanSql)) {
        const [title, targetAmount, category, goalId, userId] = params;
        const goal = mem.goals.find((g) => g.id === Number(goalId) && g.user_id === Number(userId));
        if (goal) {
            if (title !== null) goal.title = title;
            if (targetAmount !== null) goal.target_amount = Number(targetAmount);
            if (category !== null) goal.category = category;
            return { rows: [{ ...goal }] };
        }
        return { rows: [] };
    }

    // addGoalProgress
    if (/UPDATE goals SET current_amount = current_amount \+ \$1/i.test(cleanSql)) {
        const [amount, goalId, userId] = params;
        const goal = mem.goals.find((g) => g.id === Number(goalId) && g.user_id === Number(userId));
        if (goal) {
            goal.current_amount = (goal.current_amount || 0) + Number(amount);
            return { rows: [{ ...goal }] };
        }
        return { rows: [] };
    }

    // deleteGoal
    if (/DELETE FROM goals WHERE id = \$1 AND user_id = \$2/i.test(cleanSql)) {
        const [goalId, userId] = params.map(Number);
        const idx = mem.goals.findIndex((g) => g.id === goalId && g.user_id === userId);
        if (idx !== -1) {
            const [deleted] = mem.goals.splice(idx, 1);
            return { rows: [{ ...deleted }] };
        }
        return { rows: [] };
    }

    // 4. TRANSACTIONS
    // createTransaction
    if (/INSERT INTO transactions/i.test(cleanSql)) {
        const [userId, type, amount, category, description, transactionDate, goalId] = params;
        const newTx = {
            id: mem.txIdSeq++,
            user_id: Number(userId),
            type,
            amount: Number(amount),
            category: category || null,
            description: description || null,
            transaction_date: transactionDate || new Date(),
            goal_id: goalId ? Number(goalId) : null,
            created_at: new Date(),
        };
        mem.transactions.push(newTx);
        return { rows: [{ ...newTx }] };
    }

    // listTransactions
    if (/FROM transactions WHERE user_id = \$1 ORDER BY/i.test(cleanSql)) {
        const userId = Number(params[0]);
        const userTxs = mem.transactions
            .filter((t) => t.user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return { rows: userTxs.map((t) => ({ ...t })) };
    }

    // updateTransaction
    if (/UPDATE transactions SET type = COALESCE/i.test(cleanSql)) {
        const [type, amount, category, description, transactionDate, goalId, txId, userId] = params;
        const tx = mem.transactions.find((t) => t.id === Number(txId) && t.user_id === Number(userId));
        if (tx) {
            if (type !== null) tx.type = type;
            if (amount !== null) tx.amount = Number(amount);
            if (category !== null) tx.category = category;
            if (description !== null) tx.description = description;
            if (transactionDate !== null) tx.transaction_date = transactionDate;
            if (goalId !== null) tx.goal_id = Number(goalId);
            return { rows: [{ ...tx }] };
        }
        return { rows: [] };
    }

    // deleteTransaction
    if (/DELETE FROM transactions WHERE id = \$1 AND user_id = \$2/i.test(cleanSql)) {
        const [txId, userId] = params.map(Number);
        const idx = mem.transactions.findIndex((t) => t.id === txId && t.user_id === userId);
        if (idx !== -1) {
            const [deleted] = mem.transactions.splice(idx, 1);
            return { rows: [{ ...deleted }] };
        }
        return { rows: [] };
    }

    // getTransactionSummary
    if (/SUM\(CASE WHEN type = 'income'/i.test(cleanSql)) {
        const userId = Number(params[0]);
        const userTxs = mem.transactions.filter((t) => t.user_id === userId);
        let income = 0;
        let expense = 0;
        let saving = 0;

        for (const t of userTxs) {
            if (t.type === "income") income += Number(t.amount || 0);
            if (t.type === "expense") expense += Number(t.amount || 0);
            if (t.type === "saving") saving += Number(t.amount || 0);
        }

        return { rows: [{ income, expense, saving }] };
    }

    // findTransactionById
    if (/FROM transactions WHERE id = \$1 AND user_id = \$2/i.test(cleanSql)) {
        const [txId, userId] = params.map(Number);
        const tx = mem.transactions.find((t) => t.id === txId && t.user_id === userId);
        return { rows: tx ? [{ ...tx }] : [] };
    }

    // 5. FEED
    // getUserFeed
    if (/FROM transactions t LEFT JOIN/i.test(cleanSql)) {
        const userId = Number(params[0]);
        const userTxs = mem.transactions
            .filter((t) => t.user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const rows = userTxs.map((t) => {
            const likesCount = mem.feed_likes.filter(
                (l) => l.item_type === t.type && l.item_id === t.id
            ).length;
            const commentsCount = mem.feed_comments.filter(
                (c) => c.item_type === t.type && c.item_id === t.id
            ).length;
            const likedByMe = mem.feed_likes.some(
                (l) => l.item_type === t.type && l.item_id === t.id && l.user_id === userId
            );

            let title = "Nova atividade";
            if (t.type === "income") title = "Nova renda registrada";
            if (t.type === "expense") title = "Novo gasto registrado";
            if (t.type === "saving") title = "Dinheiro guardado";

            return {
                id: t.id,
                type: t.type,
                title,
                amount: t.amount,
                category: t.category,
                description: t.description,
                transactionDate: t.transaction_date,
                createdAt: t.created_at,
                goalId: t.goal_id,
                likesCount,
                commentsCount,
                likedByMe,
            };
        });

        return { rows };
    }

    // toggleFeedLike: check existing
    if (/SELECT id FROM feed_likes WHERE user_id = \$1 AND item_type = \$2 AND item_id = \$3/i.test(cleanSql)) {
        const [userId, itemType, itemId] = params;
        const found = mem.feed_likes.find(
            (l) => l.user_id === Number(userId) && l.item_type === itemType && l.item_id === Number(itemId)
        );
        return { rows: found ? [{ id: found.id }] : [] };
    }

    // toggleFeedLike: delete
    if (/DELETE FROM feed_likes WHERE user_id = \$1 AND item_type = \$2 AND item_id = \$3/i.test(cleanSql)) {
        const [userId, itemType, itemId] = params;
        const idx = mem.feed_likes.findIndex(
            (l) => l.user_id === Number(userId) && l.item_type === itemType && l.item_id === Number(itemId)
        );
        if (idx !== -1) mem.feed_likes.splice(idx, 1);
        return { rows: [] };
    }

    // toggleFeedLike: insert
    if (/INSERT INTO feed_likes/i.test(cleanSql)) {
        const [userId, itemType, itemId] = params;
        mem.feed_likes.push({
            id: mem.likeIdSeq++,
            user_id: Number(userId),
            item_type: itemType,
            item_id: Number(itemId),
        });
        return { rows: [] };
    }

    // createFeedComment
    if (/INSERT INTO feed_comments/i.test(cleanSql)) {
        const [userId, itemType, itemId, comment] = params;
        const newC = {
            id: mem.commentIdSeq++,
            user_id: Number(userId),
            item_type: itemType,
            item_id: Number(itemId),
            comment,
            created_at: new Date(),
        };
        mem.feed_comments.push(newC);
        return { rows: [{ ...newC }] };
    }

    // listFeedComments
    if (/FROM feed_comments fc JOIN users u/i.test(cleanSql)) {
        const [itemType, itemId] = params;
        const comments = mem.feed_comments
            .filter((c) => c.item_type === itemType && c.item_id === Number(itemId))
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .map((c) => {
                const user = mem.users.find((u) => u.id === c.user_id) || {};
                return {
                    id: c.id,
                    comment: c.comment,
                    createdAt: c.created_at,
                    userId: c.user_id,
                    name: user.name || "Usuário",
                    avatarUrl: user.avatar_url || null,
                };
            });

        return { rows: comments };
    }

    // 6. PASSWORD RESETS
    if (/INSERT INTO password_resets/i.test(cleanSql)) {
        const [userId, token] = params;
        const pr = {
            id: mem.resetIdSeq++,
            user_id: Number(userId),
            token,
            used: false,
            expires_at: new Date(Date.now() + 30 * 60 * 1000),
        };
        mem.password_resets.push(pr);
        return { rows: [{ ...pr }] };
    }

    if (/FROM password_resets WHERE token = \$1 AND used = false/i.test(cleanSql)) {
        const [token] = params;
        const pr = mem.password_resets.find(
            (p) => p.token === token && !p.used && new Date(p.expires_at) > new Date()
        );
        return { rows: pr ? [{ ...pr }] : [] };
    }

    if (/UPDATE password_resets SET used = true WHERE token = \$1/i.test(cleanSql)) {
        const [token] = params;
        const pr = mem.password_resets.find((p) => p.token === token);
        if (pr) pr.used = true;
        return { rows: pr ? [{ ...pr }] : [] };
    }

    if (/DELETE FROM password_resets/i.test(cleanSql)) {
        const [userId] = params;
        mem.password_resets = mem.password_resets.filter(
            (p) => p.user_id !== Number(userId) && new Date(p.expires_at) >= new Date() && !p.used
        );
        return { rows: [] };
    }

    // Generic fallback for any other query
    console.log("[CashBattle Mock DB] Unhandled query, returning empty array:", cleanSql);
    return { rows: [] };
}

// Proxied DB Pool object matching pg.Pool interface
const pool = {
    async query(sql, params) {
        if (!useMock && realPool) {
            try {
                return await realPool.query(sql, params);
            } catch (err) {
                console.warn("[CashBattle] Erro no PostgreSQL, fazendo fallback para mock:", err.message);
                useMock = true;
                realPool = null;
                return await mockQuery(sql, params);
            }
        }
        return await mockQuery(sql, params);
    },

    async connect() {
        if (!useMock && realPool) {
            try {
                return await realPool.connect();
            } catch (err) {
                console.warn("[CashBattle] Falha na conexão real, usando mock client");
                useMock = true;
                realPool = null;
            }
        }
        return {
            query: async (sql, params) => pool.query(sql, params),
            release: () => {},
        };
    },
};

export default pool;
