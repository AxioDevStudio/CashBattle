import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Search,
    Pencil,
    Trash2,
    Plus,
    PiggyBank
} from "lucide-react";

import api from "../../services/api";
import "../../styles/pages/savings.css";

function Savings() {
    const navigate = useNavigate();

    const [savings, setSavings] = useState([]);
    const [goals, setGoals] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    async function loadSavings() {
        try {
            setLoading(true);

            const token = localStorage.getItem("cashbattle_token");
            const headers = { Authorization: `Bearer ${token}` };

            const transactionsResponse = await api.get("/transactions", { headers });
            const goalsResponse = await api.get("/goals", { headers });

            const data = transactionsResponse.data.transactions
                .filter((item) => item.type === "saving")
                .sort(
                    (a, b) =>
                        new Date(b.transaction_date) -
                        new Date(a.transaction_date)
                );

            setSavings(data);
            setGoals(goalsResponse.data.goals || []);
        } catch (error) {
            console.error("Erro ao carregar economias:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSavings();
    }, []);

    async function removeSaving(id) {
        if (!window.confirm("Excluir este valor guardado?")) return;

        const token = localStorage.getItem("cashbattle_token");

        await api.delete(`/transactions/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        loadSavings();
    }

    function getGoalName(goalId) {
        const goal = goals.find((item) => item.id === goalId);
        return goal?.title || "Sem objetivo específico";
    }

    const filtered = useMemo(() => {
        return savings.filter((item) => {
            const goalName = getGoalName(item.goal_id);

            const text = `${item.category} ${item.description} ${goalName}`.toLowerCase();

            return text.includes(search.toLowerCase());
        });
    }, [savings, search, goals]);

    const total = filtered.reduce((acc, item) => acc + Number(item.amount), 0);

    function money(value) {
        return Number(value || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    return (
        <main className="savings-page">
            <header className="savings-header">
                <button onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={22} />
                </button>

                <div>
                    <h1>Guardado</h1>
                    <p>{filtered.length} registros</p>
                </div>

                <button
                    className="add-button"
                    onClick={() => navigate("/transaction")}
                >
                    <Plus size={20} />
                </button>
            </header>

            <section className="savings-summary">
                <PiggyBank size={32} />
                <span>Total guardado</span>
                <h2>{money(total)}</h2>
            </section>

            <div className="savings-search">
                <Search size={18} />

                <input
                    placeholder="Pesquisar economia..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading && <p className="savings-empty">Carregando valores...</p>}

            {!loading && filtered.length === 0 && (
                <section className="savings-empty">
                    <PiggyBank size={52} />
                    <h3>Nenhum valor guardado</h3>
                    <p>Quando você guardar dinheiro, o registro aparecerá aqui.</p>

                    <button onClick={() => navigate("/transaction")}>
                        Guardar dinheiro
                    </button>
                </section>
            )}

            <section className="savings-list">
                {filtered.map((saving) => (
                    <article key={saving.id} className="savings-card">
                        <div>
                            <h3>{saving.category}</h3>
                            <p>{saving.description || getGoalName(saving.goal_id)}</p>
                            <small>
                                {getGoalName(saving.goal_id)} •{" "}
                                {new Date(saving.transaction_date).toLocaleDateString(
                                    "pt-BR"
                                )}
                            </small>
                        </div>

                        <div className="savings-actions">
                            <strong>{money(saving.amount)}</strong>

                            <div>
                                <button
                                    onClick={() =>
                                        navigate(`/transaction/${saving.id}`)
                                    }
                                >
                                    <Pencil size={16} />
                                </button>

                                <button onClick={() => removeSaving(saving.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}

export default Savings;