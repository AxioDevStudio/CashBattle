import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Plus,
    Target,
    Pencil,
    Trash2,
    Wallet
} from "lucide-react";

import api from "../../services/api";
import "../../styles/pages/goals.css";

function Goals() {
    const navigate = useNavigate();

    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [title, setTitle] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [category, setCategory] = useState("");

    const [editOpen, setEditOpen] = useState(false);
    const [progressOpen, setProgressOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    const [editForm, setEditForm] = useState({
        title: "",
        targetAmount: "",
        category: ""
    });

    const [progressAmount, setProgressAmount] = useState("");

    function getToken() {
        return localStorage.getItem("cashbattle_token");
    }

    function money(value) {
        return Number(value || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function showMessage(text) {
        setMessage(text);
        setError("");

        setTimeout(() => {
            setMessage("");
        }, 3000);
    }

    function showError(text) {
        setError(text);
        setMessage("");

        setTimeout(() => {
            setError("");
        }, 3000);
    }

    async function loadGoals() {
        try {
            const response = await api.get("/goals", {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            setGoals(response.data.goals || []);
        } catch {
            showError("Não foi possível carregar seus objetivos.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(event) {
        event.preventDefault();

        if (!title.trim()) {
            showError("Informe o nome do objetivo.");
            return;
        }

        if (!targetAmount || Number(targetAmount) <= 0) {
            showError("Informe um valor alvo válido.");
            return;
        }

        try {
            setSaving(true);

            await api.post(
                "/goals",
                {
                    title,
                    targetAmount: Number(targetAmount),
                    category
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setTitle("");
            setTargetAmount("");
            setCategory("");

            showMessage("Objetivo criado com sucesso.");
            await loadGoals();
        } catch (err) {
            showError(
                err.response?.data?.error ||
                "Não foi possível criar o objetivo."
            );
        } finally {
            setSaving(false);
        }
    }

    function openEdit(goal) {
        setSelectedGoal(goal);

        setEditForm({
            title: goal.title || "",
            targetAmount: goal.target_amount || "",
            category: goal.category || ""
        });

        setEditOpen(true);
    }

    async function handleEdit(event) {
        event.preventDefault();

        if (!selectedGoal) return;

        try {
            setSaving(true);

            await api.put(
                `/goals/${selectedGoal.id}`,
                {
                    title: editForm.title,
                    targetAmount: Number(editForm.targetAmount),
                    category: editForm.category
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setEditOpen(false);
            setSelectedGoal(null);
            showMessage("Objetivo atualizado.");
            await loadGoals();
        } catch (err) {
            showError(
                err.response?.data?.error ||
                "Não foi possível atualizar o objetivo."
            );
        } finally {
            setSaving(false);
        }
    }

    function openProgress(goal) {
        setSelectedGoal(goal);
        setProgressAmount("");
        setProgressOpen(true);
    }

    async function handleAddProgress(event) {
        event.preventDefault();

        if (!selectedGoal) return;

        if (!progressAmount || Number(progressAmount) <= 0) {
            showError("Informe um valor válido.");
            return;
        }

        try {
            setSaving(true);

            await api.patch(
                `/goals/${selectedGoal.id}/progress`,
                {
                    amount: Number(progressAmount)
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setProgressOpen(false);
            setSelectedGoal(null);
            setProgressAmount("");
            showMessage("Valor adicionado ao objetivo.");
            await loadGoals();
        } catch (err) {
            showError(
                err.response?.data?.error ||
                "Não foi possível adicionar o valor."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(goal) {
        const confirmed = window.confirm(
            `Deseja excluir o objetivo "${goal.title}"?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`/goals/${goal.id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            showMessage("Objetivo removido.");
            await loadGoals();
        } catch (err) {
            showError(
                err.response?.data?.error ||
                "Não foi possível remover o objetivo."
            );
        }
    }

    useEffect(() => {
        loadGoals();
    }, []);

    if (loading) {
        return (
            <main className="goals-page">
                <p>Carregando objetivos...</p>
            </main>
        );
    }

    return (
        <main className="goals-page">
            <header className="goals-header">
                <button onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={22} />
                </button>

                <div>
                    <span>CashBattle</span>
                    <h1>Objetivos</h1>
                </div>
            </header>

            {message && <span className="goals-success">{message}</span>}
            {error && <span className="goals-error">{error}</span>}

            <section className="goals-intro">
                <div>
                    <Target size={24} />
                </div>

                <h2>Construa seu próximo passo</h2>
                <p>
                    Crie metas simples, acompanhe seu progresso e transforme
                    cada valor guardado em conquista.
                </p>
            </section>

            <form className="goal-form" onSubmit={handleCreate}>
                <label>Nome do objetivo</label>
                <input
                    placeholder="Ex: Notebook novo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label>Valor alvo</label>
                <input
                    type="number"
                    placeholder="Ex: 5000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                />

                <label>Categoria</label>
                <input
                    placeholder="Ex: Tecnologia, Viagem, Reserva..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <button disabled={saving}>
                    <Plus size={20} />
                    {saving ? "Criando..." : "Criar objetivo"}
                </button>
            </form>

            <section className="goals-list">
                {goals.length === 0 ? (
                    <article className="empty-goals">
                        <h3>Nenhum objetivo criado ainda</h3>
                        <p>
                            Comece com uma meta pequena. O importante é ter
                            clareza do que você quer alcançar.
                        </p>
                    </article>
                ) : (
                    goals.map((goal) => {
                        const current = Number(goal.current_amount || 0);
                        const target = Number(goal.target_amount || 0);

                        const percent =
                            target > 0
                                ? Math.min((current / target) * 100, 100)
                                : 0;

                        const completed = percent >= 100;

                        return (
                            <article
                                key={goal.id}
                                className={`goal-item ${
                                    completed ? "goal-completed" : ""
                                }`}
                            >
                                <div className="goal-item-header">
                                    <div>
                                        <h3>{goal.title}</h3>
                                        <p>{goal.category || "Sem categoria"}</p>
                                    </div>

                                    <span>{percent.toFixed(0)}%</span>
                                </div>

                                <strong>
                                    {money(current)} de {money(target)}
                                </strong>

                                <div className="goal-mini-progress">
                                    <div style={{ width: `${percent}%` }}></div>
                                </div>

                                {completed && (
                                    <small className="goal-completed-label">
                                        Objetivo concluído
                                    </small>
                                )}

                                <div className="goal-actions">
                                    <button onClick={() => openProgress(goal)}>
                                        <Wallet size={16} />
                                        Adicionar
                                    </button>

                                    <button onClick={() => openEdit(goal)}>
                                        <Pencil size={16} />
                                        Editar
                                    </button>

                                    <button
                                        className="danger"
                                        onClick={() => handleDelete(goal)}
                                    >
                                        <Trash2 size={16} />
                                        Excluir
                                    </button>
                                </div>
                            </article>
                        );
                    })
                )}
            </section>

            {editOpen && (
                <div className="modal-overlay">
                    <form className="goal-modal" onSubmit={handleEdit}>
                        <h2>Editar objetivo</h2>

                        <label>Nome</label>
                        <input
                            value={editForm.title}
                            onChange={(e) =>
                                setEditForm({
                                    ...editForm,
                                    title: e.target.value
                                })
                            }
                        />

                        <label>Valor alvo</label>
                        <input
                            type="number"
                            value={editForm.targetAmount}
                            onChange={(e) =>
                                setEditForm({
                                    ...editForm,
                                    targetAmount: e.target.value
                                })
                            }
                        />

                        <label>Categoria</label>
                        <input
                            value={editForm.category}
                            onChange={(e) =>
                                setEditForm({
                                    ...editForm,
                                    category: e.target.value
                                })
                            }
                        />

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={() => setEditOpen(false)}
                            >
                                Cancelar
                            </button>

                            <button type="submit" disabled={saving}>
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {progressOpen && (
                <div className="modal-overlay">
                    <form className="goal-modal" onSubmit={handleAddProgress}>
                        <h2>Adicionar dinheiro</h2>

                        <p>
                            Objetivo: <strong>{selectedGoal?.title}</strong>
                        </p>

                        <label>Valor</label>
                        <input
                            type="number"
                            placeholder="Ex: 100"
                            value={progressAmount}
                            onChange={(e) => setProgressAmount(e.target.value)}
                        />

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={() => setProgressOpen(false)}
                            >
                                Cancelar
                            </button>

                            <button type="submit" disabled={saving}>
                                Adicionar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}

export default Goals;