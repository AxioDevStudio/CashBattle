import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    Trophy,
    Target,
    Plus,
    RefreshCw,
    Heart,
    MessageCircle,
    Share2
} from "lucide-react";

import api from "../../services/api";
import "../../styles/pages/feed.css";

function Feed() {
    const navigate = useNavigate();

    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState({});
    const [commentText, setCommentText] = useState({});

    function getToken() {
        return localStorage.getItem("cashbattle_token");
    }

    function getKey(item) {
        return `${item.type}-${item.id}`;
    }

    async function loadFeed() {
        try {
            setLoading(true);

            const response = await api.get("/feed", {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            setFeed(response.data.feed || []);
        } catch (error) {
            console.error("Erro ao carregar feed:", error);
        } finally {
            setLoading(false);
        }
    }

    async function loadComments(item) {
        const key = getKey(item);

        try {
            const response = await api.get(
                `/feed/${item.type}/${item.id}/comments`,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setComments((prev) => ({
                ...prev,
                [key]: response.data.comments || []
            }));
        } catch (error) {
            console.error("Erro ao carregar comentários:", error);
        }
    }

    useEffect(() => {
        loadFeed();
    }, []);

    function money(value) {
        return Number(value || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function getIcon(type) {
        if (type === "income") return <TrendingUp size={21} />;
        if (type === "expense") return <TrendingDown size={21} />;
        if (type === "saving") return <PiggyBank size={21} />;
        if (type === "goal") return <Target size={21} />;

        return <Trophy size={21} />;
    }

    function getText(item) {
        if (item.type === "income") return "Você registrou uma nova entrada de dinheiro.";
        if (item.type === "expense") return "Você registrou um novo gasto.";
        if (item.type === "saving") return "Você guardou dinheiro para o seu futuro.";
        if (item.type === "goal") return "Você criou um novo objetivo financeiro.";
        if (item.type === "goal_completed") return "Você concluiu um objetivo financeiro.";

        return "Nova atividade no CashBattle.";
    }

    async function toggleLike(item) {
        try {
            await api.post(
                "/feed/like",
                {
                    itemType: item.type,
                    itemId: item.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            await loadFeed();
        } catch (error) {
            console.error("Erro ao curtir:", error);
        }
    }

    async function addComment(item) {
        const key = getKey(item);
        const text = commentText[key];

        if (!text?.trim()) return;

        try {
            await api.post(
                "/feed/comment",
                {
                    itemType: item.type,
                    itemId: item.id,
                    comment: text
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setCommentText((prev) => ({
                ...prev,
                [key]: ""
            }));

            await loadComments(item);
            await loadFeed();
        } catch (error) {
            console.error("Erro ao comentar:", error);
        }
    }

    async function shareItem(item) {
        const text = `${item.title} - ${getText(item)}`;

        if (navigator.share) {
            await navigator.share({
                title: "CashBattle",
                text
            });
        } else {
            await navigator.clipboard.writeText(text);
            alert("Atividade copiada.");
        }
    }

    return (
        <main className="feed-page">
            <header className="feed-header">
                <button onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={22} />
                </button>

                <div>
                    <h1>Feed</h1>
                    <p>Suas atividades recentes</p>
                </div>

                <button onClick={loadFeed}>
                    <RefreshCw size={20} />
                </button>
            </header>

            <section className="feed-highlight">
                <div>
                    <span>Resumo</span>
                    <h2>{feed.length} atividades</h2>
                    <p>Continue registrando suas movimentações para acompanhar sua evolução.</p>
                </div>

                <Target size={38} />
            </section>

            {loading && (
                <section className="feed-empty">
                    Carregando feed...
                </section>
            )}

            {!loading && feed.length === 0 && (
                <section className="feed-empty">
                    <h3>Nenhuma atividade ainda</h3>

                    <p>
                        Registre uma transação ou crie uma meta para começar sua jornada.
                    </p>

                    <button onClick={() => navigate("/transaction")}>
                        <Plus size={18} />
                        Nova transação
                    </button>
                </section>
            )}

            <section className="feed-list">
                {feed.map((item) => {
                    const key = getKey(item);

                    return (
                        <article key={key} className="feed-card">
                            <div className={`feed-icon ${item.type}`}>
                                {getIcon(item.type)}
                            </div>

                            <div className="feed-content">
                                <div className="feed-card-header">
                                    <strong>{item.title}</strong>

                                    {item.amount && (
                                        <span className={item.type === "expense" ? "danger" : "positive"}>
                                            {item.type === "expense" ? "-" : "+"}
                                            {money(item.amount)}
                                        </span>
                                    )}
                                </div>

                                <p>{getText(item)}</p>

                                <small>
                                    {item.category || "Sem categoria"} •{" "}
                                    {formatDate(item.createdAt)}
                                </small>

                                {item.description && (
                                    <div className="feed-description">
                                        {item.description}
                                    </div>
                                )}

                                <div className="feed-actions">
                                    <button
                                        className={item.likedByMe ? "liked" : ""}
                                        onClick={() => toggleLike(item)}
                                    >
                                        <Heart size={17} />
                                        {item.likesCount || 0}
                                    </button>

                                    <button onClick={() => loadComments(item)}>
                                        <MessageCircle size={17} />
                                        {item.commentsCount || 0}
                                    </button>

                                    <button onClick={() => shareItem(item)}>
                                        <Share2 size={17} />
                                        Compartilhar
                                    </button>
                                </div>

                                <div className="feed-comment-box">
                                    <input
                                        placeholder="Escreva um comentário..."
                                        value={commentText[key] || ""}
                                        onChange={(e) =>
                                            setCommentText({
                                                ...commentText,
                                                [key]: e.target.value
                                            })
                                        }
                                    />

                                    <button onClick={() => addComment(item)}>
                                        Enviar
                                    </button>
                                </div>

                                {(comments[key] || []).map((comment) => (
                                    <div className="feed-comment" key={comment.id}>
                                        <strong>{comment.name}</strong>
                                        <p>{comment.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </article>
                    );
                })}
            </section>
        </main>
    );
}

export default Feed;