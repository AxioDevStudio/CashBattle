import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Wallet,
    TrendingUp,
    TrendingDown,
    PiggyBank
} from "lucide-react";

import api from "../../services/api";
import "../../styles/pages/transaction.css";

function Transaction() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditing = Boolean(id);

    const [type, setType] = useState("expense");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Mercado");
    const [description, setDescription] = useState("");
    const [goalId, setGoalId] = useState("");

    const [goals, setGoals] = useState([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEditing);

    const categories = {
        income: ["Salário", "Freelancer", "PIX", "Venda", "Outro"],
        expense: ["Mercado", "Delivery", "Transporte", "Lazer", "Compras", "Outro"],
        saving: ["Reserva", "Investimento", "Viagem", "Emergência", "Outro"]
    };

    useEffect(() => {
        async function loadData() {
            try {
                const token = localStorage.getItem("cashbattle_token");

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const goalsResponse = await api.get("/goals", { headers });
                setGoals(goalsResponse.data.goals || []);

                if (isEditing) {
                    const transactionResponse = await api.get(
                        `/transactions/${id}`,
                        { headers }
                    );

                    const transaction = transactionResponse.data.transaction;

                    setType(transaction.type);
                    setAmount(transaction.amount);
                    setCategory(transaction.category || categories[transaction.type][0]);
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
        setCategory(categories[newType][0]);
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
                    {categories[type].map((item) => (
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