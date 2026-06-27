import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Plus, Target, LogOut } from "lucide-react";

import api from "../../services/api";
import "../../styles/dashboard.css";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
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

                localStorage.setItem("cashbattle_user", JSON.stringify(userResponse.data.user));
            } catch (error) {
                console.error("Erro ao carregar dashboard:", error);
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    function handleLogout() {
        localStorage.removeItem("cashbattle_token");
        localStorage.removeItem("cashbattle_user");
        navigate("/login");
    }

    function getGreeting() {
        const hour = new Date().getHours();

        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    }

    function money(value) {
        return Number(value || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    if (loading) {
        return (
            <main className="dashboard-page">
                <h2>Carregando...</h2>
            </main>
        );
    }

    if (!user || !summary) {
        return (
            <main className="dashboard-page">
                <h2>Não foi possível carregar seus dados.</h2>
            </main>
        );
    }

    const goal = Number(user.monthly_goal || 0);
    const saved = Number(summary.saving || 0);
    const percent = goal > 0 ? Math.min((saved / goal) * 100, 100) : 0;

    const remaining = Math.max(goal - saved, 0);

    return (
        <main className="dashboard-page">
            <header className="home-header">
                <div>
                    <span>CashBattle</span>
                    <h1>{getGreeting()}, {user.name}</h1>
                    <p className="home-subtitle">
                        Vamos cuidar do seu dinheiro hoje.
                    </p>
                </div>

                <div className="header-actions">
                    <button
                        className="profile-button"
                        onClick={() => navigate("/profile")}
                        title="Perfil"
                    >
                        <User size={20} />
                    </button>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                        title="Sair"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <section className="main-balance">
                <p>Saldo disponível</p>

                <h2>{money(summary.balance)}</h2>

                <span>
                    {percent.toFixed(0)}% da meta mensal concluída
                </span>

                <div className="progress-bar">
                    <div style={{ width: `${percent}%` }}></div>
                </div>

                <small>
                    Faltam {money(remaining)} para alcançar sua meta.
                </small>
            </section>

            <section className="simple-grid">
                <article>
                    <p>Renda total</p>
                    <strong>{money(summary.income)}</strong>
                </article>

                <article>
                    <p>Gastos</p>
                    <strong className="danger">{money(summary.expense)}</strong>
                </article>

                <article>
                    <p>Guardado</p>
                    <strong>{money(summary.saving)}</strong>
                </article>

                <article>
                    <p>Meta</p>
                    <strong>{money(goal)}</strong>
                </article>
            </section>

            <section className="goal-card">
                <div className="goal-header">
                    <div>
                        <p>Objetivo financeiro</p>
                        <h3>{user.goal_category || "Não definido"}</h3>
                    </div>

                    <span className="goal-badge">
                        {user.competition_mode === "friends"
                            ? "Com amigos"
                            : user.competition_mode === "solo"
                            ? "Individual"
                            : user.competition_mode === "groups"
                            ? "Grupo privado"
                            : "Ranking público"}
                    </span>
                </div>

                <div className="goal-message">
                    <Target size={18} />
                    <p>
                        Cada valor guardado aproxima você da sua conquista.
                    </p>
                </div>

                <div className="goal-progress-info">
                    <span>Progresso da meta</span>
                    <strong>{percent.toFixed(0)}%</strong>
                </div>

                <div className="progress-bar">
                    <div style={{ width: `${percent}%` }}></div>
                </div>
            </section>

            <button
                className="add-transaction-button"
                onClick={() => navigate("/transaction")}
            >
                <Plus size={22} />
                Adicionar transação
            </button>
        </main>
    );
}

export default Dashboard;