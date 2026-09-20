import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    Home,
    MessageCircle,
    Plus,
    Trophy,
    User,
    Wallet,
    Flame,
    Star,
    Shield,
    PiggyBank,
    CreditCard,
    Target,
} from "lucide-react";

import api from "../../services/api";
import NetWorthCard from "../../components/dashboard/NetWorthCard";
import TransactionLogger from "../../components/transaction/TransactionLogger";
import "../../styles/pages/dashboard.css";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    async function loadDashboard() {
        try {
            const token = localStorage.getItem("cashbattle_token");

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const userResponse = await api.get("/auth/me", { headers });
            const summaryResponse = await api.get("/transactions/summary", { headers });

            setUser(userResponse.data.user);
            setSummary(summaryResponse.data);
        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    function handleTransactionLogged(newSummary) {
        if (newSummary) {
            setSummary(newSummary);
        }
        loadDashboard();
    }

    function money(value) {
        return Number(value || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    if (loading) {
        return <main className="dashboard-page">Carregando...</main>;
    }

    if (!user || !summary) {
        return <main className="dashboard-page">Não foi possível carregar os dados.</main>;
    }

    const goal = Number(user.monthly_goal || 0);
    const saved = Number(summary.saving || 0);
    const percent = goal > 0 ? Math.min((saved / goal) * 100, 100) : 0;

    return (
        <main className="dashboard-page">
            <header className="dashboard-header">
                <div>
                    <h1>Olá, {user.name}</h1>
                    <p>Visão geral do mês</p>
                </div>

                <button className="icon-button" aria-label="Notificações">
                    <Bell size={20} />
                </button>
            </header>

            {/* Main Dashboard Component: Net Worth & Monthly Savings Goal Progress Bar */}
            <NetWorthCard
                netWorth={summary.netWorth}
                balance={summary.balance}
                saved={summary.saving}
                monthlyGoal={user.monthly_goal}
                income={summary.income}
                expense={summary.expense}
                goalCategory={user.goal_category}
                formatMoney={money}
                onViewGoals={() => navigate("/goals")}
                onAddSavings={() => navigate("/savings")}
            />

            {/* Transaction Logging Component: Input Income/Expenses & Update Net Worth Dynamically */}
            <TransactionLogger
                currentNetWorth={summary.netWorth}
                currentBalance={summary.balance}
                currentSaved={summary.saving}
                onTransactionLogged={handleTransactionLogged}
            />

            <section className="month-card">
                <div className="month-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                    <article>
                        <span>Receitas</span>
                        <strong>{money(summary.income)}</strong>
                    </article>

                    <article>
                        <span>Despesas</span>
                        <strong className="danger">{money(summary.expense)}</strong>
                    </article>
                </div>
            </section>

            <section className="journey-card">
                <div className="journey-header">
                    <div>
                        <p>Sua jornada</p>
                        <h2>Nível {user.level || 1}</h2>
                        <span>Disciplina financeira</span>
                    </div>

                    <div className="level-badge">
                        <Shield size={28} />
                    </div>
                </div>

                <div className="progress-line">
                    <div style={{ width: `${Math.min((Number(user.xp || 0) / 500) * 100, 100)}%` }} />
                </div>

                <small>{user.xp || 0} / 500 XP</small>
            </section>

            <section className="mini-cards">
                <article>
                    <Flame size={22} />
                    <span>Streak</span>
                    <strong>{user.streak || 0} dias</strong>
                </article>

                <article>
                    <Star size={22} />
                    <span>XP total</span>
                    <strong>{user.xp || 0}</strong>
                </article>
            </section>

            <section className="goal-section">
                <div className="section-title">
                    <h2>Objetivo atual</h2>
                    <button onClick={() => navigate("/goals")}>Ver todos</button>
                </div>

                <article className="goal-card">
                    <div className="goal-icon">
                        <Target size={22} />
                    </div>

                    <div>
                        <h3>{user.goal_category || "Meta financeira"}</h3>
                        <p>{money(saved)} de {money(goal)}</p>

                        <div className="progress-line">
                            <div style={{ width: `${percent}%` }} />
                        </div>
                    </div>

                    <strong>{percent.toFixed(0)}%</strong>
                </article>
            </section>

            <section className="quick-actions">
                <button onClick={() => navigate("/income")}>
                    <Wallet size={22} />
                    Receitas
                </button>

                <button onClick={() => navigate("/expenses")}>
                    <CreditCard size={22} />
                    Gastos
                </button>

                <button onClick={() => navigate("/savings")}>
                    <PiggyBank size={22} />
                    Guardado
                </button>

                <button onClick={() => navigate("/goals")}>
                    <Target size={22} />
                    Objetivos
                </button>
            </section>

            <nav className="bottom-nav">
                <button className="active" onClick={() => navigate("/dashboard")}>
                    <Home size={21} />
                    <span>Início</span>
                </button>

                <button onClick={() => navigate("/feed")}>
                    <MessageCircle size={21} />
                    <span>Feed</span>
                </button>

                <button className="main-action" onClick={() => navigate("/transaction")}>
                    <Plus size={26} />
                </button>

                <button onClick={() => navigate("/ranking")}>
                    <Trophy size={21} />
                    <span>Ranking</span>
                </button>
                
                <button onClick={() => navigate("/profile")}>
                    <User size={21} />
                    <span>Perfil</span>
                </button>
            </nav>
        </main>
    );
}

export default Dashboard;