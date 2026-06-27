import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Camera,
    Trophy,
    Target,
    Wallet,
    Flame,
    Star,
    LogOut
} from "lucide-react";

import api from "../../services/api";
import "../../styles/profile.css";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState(null);
    const [goals, setGoals] = useState([]);
    const [avatar, setAvatar] = useState(
        localStorage.getItem("cashbattle_avatar") || ""
    );

    useEffect(() => {
        async function loadProfile() {
            try {
                const token = localStorage.getItem("cashbattle_token");

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const userResponse = await api.get("/auth/me", { headers });
                const summaryResponse = await api.get("/transactions/summary", { headers });
                const goalsResponse = await api.get("/goals", { headers });

                setUser(userResponse.data.user);
                setSummary(summaryResponse.data);
                setGoals(goalsResponse.data.goals || []);
            } catch (error) {
                console.error("Erro ao carregar perfil:", error);
            }
        }

        loadProfile();
    }, []);

    function handleAvatarChange(event) {
        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            localStorage.setItem("cashbattle_avatar", reader.result);
            setAvatar(reader.result);
        };

        reader.readAsDataURL(file);
    }

    function handleLogout() {
        localStorage.removeItem("cashbattle_token");
        localStorage.removeItem("cashbattle_user");
        localStorage.removeItem("cashbattle_avatar");

        navigate("/login");
    }

    function money(value) {
        return Number(value || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    if (!user || !summary) {
        return (
            <main className="profile-page">
                <p>Carregando perfil...</p>
            </main>
        );
    }

    const achievements = [
        {
            title: "Primeira transação",
            description: "Você registrou sua primeira movimentação.",
            unlocked: summary.expense > 0 || summary.saving > 0 || summary.extraIncome > 0,
        },
        {
            title: "Primeiro dinheiro guardado",
            description: "Você começou a construir sua reserva.",
            unlocked: summary.saving > 0,
        },
        {
            title: "Criador de metas",
            description: "Você criou pelo menos um objetivo financeiro.",
            unlocked: goals.length > 0,
        },
        {
            title: "R$100 guardados",
            description: "Você já guardou pelo menos R$100.",
            unlocked: summary.saving >= 100,
        },
        {
            title: "Meta em progresso",
            description: "Você começou a avançar em algum objetivo.",
            unlocked: goals.some((goal) => Number(goal.current_amount) > 0),
        },
    ];

    const unlockedAchievements = achievements.filter((item) => item.unlocked).length;

    return (
        <main className="profile-page">
            <header className="profile-topbar">
                <button onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={22} />
                </button>

                <div>
                    <span>CashBattle</span>
                    <h1>Perfil</h1>
                </div>

                <button onClick={handleLogout} className="danger-button">
                    <LogOut size={22} />
                </button>
            </header>

            <section className="profile-header">
                <label className="avatar-upload">
                    {avatar ? (
                        <img src={avatar} alt="Foto de perfil" />
                    ) : (
                        <span>{user.name?.charAt(0)}</span>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />

                    <div className="camera-badge">
                        <Camera size={16} />
                    </div>
                </label>

                <h1>{user.name}</h1>
                <p>{user.email}</p>

                <span className="profile-mode">
                    {user.competition_mode === "friends"
                        ? "Competindo com amigos"
                        : user.competition_mode === "solo"
                        ? "Jornada individual"
                        : user.competition_mode === "groups"
                        ? "Grupo privado"
                        : "Ranking público"}
                </span>
            </section>

            <section className="profile-stats">
                <article>
                    <Star size={20} />
                    <span>XP</span>
                    <strong>{user.xp || 0}</strong>
                </article>

                <article>
                    <Trophy size={20} />
                    <span>Nível</span>
                    <strong>{user.level || 1}</strong>
                </article>

                <article>
                    <Flame size={20} />
                    <span>Streak</span>
                    <strong>{user.streak || 0}</strong>
                </article>
            </section>

            <section className="profile-summary">
                <article>
                    <Wallet size={22} />
                    <div>
                        <p>Total economizado</p>
                        <strong>{money(summary.saving)}</strong>
                    </div>
                </article>

                <article>
                    <Target size={22} />
                    <div>
                        <p>Objetivos ativos</p>
                        <strong>{goals.length}</strong>
                    </div>
                </article>

                <article>
                    <Trophy size={22} />
                    <div>
                        <p>Conquistas</p>
                        <strong>
                            {unlockedAchievements}/{achievements.length}
                        </strong>
                    </div>
                </article>
            </section>

            <section className="profile-goals">
                <div className="section-title">
                    <h2>Objetivos</h2>
                    <button onClick={() => navigate("/goals")}>
                        Ver todos
                    </button>
                </div>

                {goals.length === 0 ? (
                    <p className="empty-text">
                        Você ainda não criou objetivos financeiros.
                    </p>
                ) : (
                    goals.slice(0, 2).map((goal) => {
                        const percent = Math.min(
                            (Number(goal.current_amount || 0) /
                                Number(goal.target_amount || 1)) *
                                100,
                            100
                        );

                        return (
                            <article key={goal.id} className="profile-goal-card">
                                <div>
                                    <h3>{goal.title}</h3>
                                    <p>{goal.category || "Sem categoria"}</p>
                                </div>

                                <strong>{percent.toFixed(0)}%</strong>

                                <div className="goal-mini-progress">
                                    <div style={{ width: `${percent}%` }}></div>
                                </div>
                            </article>
                        );
                    })
                )}
            </section>

            <section className="achievement-section">
                <div className="section-title">
                    <h2>Conquistas</h2>
                    <span>{unlockedAchievements} desbloqueadas</span>
                </div>

                {achievements.map((item) => (
                    <article
                        key={item.title}
                        className={item.unlocked ? "achievement unlocked" : "achievement"}
                    >
                        <div>{item.unlocked ? "✓" : "○"}</div>

                        <section>
                            <span>{item.title}</span>
                            <p>{item.description}</p>
                        </section>
                    </article>
                ))}
            </section>
        </main>
    );
}

export default Profile;