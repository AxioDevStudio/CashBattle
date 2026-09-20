import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Wallet,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

import api from "../../services/api";
import "../../styles/pages/transaction.css";

const CATEGORIES = {
    income: ["Salário", "Freelancer", "PIX", "Venda", "Outro"],
    expense: ["Mercado", "Delivery", "Transporte", "Lazer", "Compras", "Outro"],
    saving: ["Reserva", "Investimento", "Viagem", "Emergência", "Outro"]
};

function Transaction() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditing = Boolean(id);

    const [type, setType] = useState("expense");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Mercado");
    const [description, setDescription] = useState("");
    const [goalId, setGoalId] = useState("");
    const [currentNetWorth, setCurrentNetWorth] = useState(0);

    const [goals, setGoals] = useState([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEditing);

    useEffect(() => {
        async function loadData() {
            try {
                const token = localStorage.getItem("cashbattle_token");

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [goalsResponse, summaryResponse] = await Promise.all([
                    api.get("/goals", { headers }).catch(() => ({ data: { goals: [] } })),
                    api.get("/transactions/summary", { headers }).catch(() => ({ data: { netWorth: 0 } }))
                ]);

                setGoals(goalsResponse.data.goals || []);
                setCurrentNetWorth(Number(summaryResponse.data?.netWorth || 0));

                if (isEditing) {
                    const transactionResponse = await api.get(
                        `/transactions/${id}`,
                        { headers }
                    );

                    const transaction = transactionResponse.data.transaction;

                    setType(transaction.type);
                    setAmount(transaction.amount);
                    setCategory(transaction.category || CATEGORIES[transaction.type][0]);
                    setDescription(transaction.description || "");
                    setGoalId(transaction.goal_id || "");
                }
            } catch (err) {
                console.error(err);
                setError("Não foi possível carregar os dados.");
            } finally {
                setPageLoading(false);
            }
        }

        loadData();
    }, [id, isEditing]);

    function changeType(newType) {
        setType(newType);
        setCategory(CATEGORIES[newType][0]);
        setGoalId("");
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (!amount || Number(amount) <= 0) {
            setError("Informe um valor válido.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("cashbattle_token");

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const payload = {
                type,
                amount: Number(amount),
                category,
                description,
                goalId: type === "saving" ? goalId || null : null,
            };

            if (isEditing) {
                await api.put(`/transactions/${id}`, payload, { headers });
            } else {
                await api.post("/transactions", payload, { headers });
            }

            if (type === "income") {
                navigate("/income");
            } else if (type === "saving") {
                navigate("/savings");
            } else {
                navigate("/expenses");
            }
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Não foi possível salvar a transação."
            );
        } finally {
            setLoading(false);
        }
    }

    function formatMoney(val) {
        return Number(val || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    const numAmount = parseFloat(String(amount || "").replace(",", ".")) || 0;
    let projectedNetWorth = Number(currentNetWorth || 0);
    if (type === "income") {
        projectedNetWorth += numAmount;
    } else if (type === "expense") {
        projectedNetWorth -= numAmount;
    }

    if (pageLoading) {
        return (
            <main className="transaction-page">
                <p>Carregando transação...</p>
            </main>
        );
    }

    return (
        <main className="transaction-page">
            <header className="transaction-header">
                <button onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={22} />
                </button>

                <div>
                    <span>CashBattle</span>
                    <h1>{isEditing ? "Editar transação" : "Nova transação"}</h1>
                </div>
            </header>

            <section className="type-selector">
                <button
                    type="button"
                    className={type === "income" ? "active income" : ""}
                    onClick={() => changeType("income")}
                >
                    <TrendingUp size={20} />
                    Receita
                </button>

                <button
                    type="button"
                    className={type === "expense" ? "active danger" : ""}
                    onClick={() => changeType("expense")}
                >
                    <TrendingDown size={20} />
                    Gasto
                </button>

                <button
                    type="button"
                    className={type === "saving" ? "active saving" : ""}
                    onClick={() => changeType("saving")}
                >
                    <PiggyBank size={20} />
                    Guardar
                </button>
            </section>

            <form className="transaction-card" onSubmit={handleSubmit}>
                <label>Valor</label>

                <div className="money-input">
                    <Wallet size={22} />

                    <input
                        type="number"
                        placeholder="0,00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <label>Categoria</label>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {(CATEGORIES[type] || []).map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                {type === "saving" && (
                    <>
                        <label>Objetivo financeiro</label>

                        <select
                            value={goalId}
                            onChange={(e) => setGoalId(e.target.value)}
                        >
                            <option value="">Sem objetivo específico</option>

                            {goals.map((goal) => (
                                <option key={goal.id} value={goal.id}>
                                    {goal.title}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <label>Descrição</label>

                <textarea
                    placeholder="Ex: compra do mês, salário, dinheiro guardado..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* Live Dynamic Net Worth Impact Preview */}
                {numAmount > 0 && (
                    <div
                        className={`dynamic-net-worth-preview ${
                            type === "income"
                                ? "positive"
                                : type === "expense"
                                ? "negative"
                                : ""
                        }`}
                        style={{ marginBottom: "16px" }}
                    >
                        <div className="preview-top-row">
                            <span className="preview-label">Impacto no Patrimônio Líquido</span>
                            <span className="preview-impact">
                                {type === "income" ? (
                                    <span className="impact-pos">
                                        <ArrowUpRight size={14} />+{formatMoney(numAmount)}
                                    </span>
                                ) : type === "expense" ? (
                                    <span className="impact-neg">
                                        <ArrowDownRight size={14} />-{formatMoney(numAmount)}
                                    </span>
                                ) : (
                                    <span className="impact-neutral">
                                        ± {formatMoney(0)} (Poupança)
                                    </span>
                                )}
                            </span>
                        </div>
                        <div className="preview-bottom-row">
                            <span className="projected-label">Patrimônio projetado:</span>
                            <strong className="projected-value">
                                {formatMoney(projectedNetWorth)}
                            </strong>
                        </div>
                    </div>
                )}

                {error && <span className="transaction-error">{error}</span>}

                <button className="save-transaction" disabled={loading}>
                    {loading
                        ? "Salvando..."
                        : isEditing
                        ? "Salvar alterações"
                        : "Salvar transação"}
                </button>
            </form>
        </main>
    );
}

export default Transaction;