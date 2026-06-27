import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Wallet,
    TrendingUp,
    TrendingDown,
    PiggyBank
} from "lucide-react";

import api from "../../services/api";
import "../../styles/transaction.css";

function Transaction() {
    const navigate = useNavigate();

    const [type, setType] = useState("expense");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Mercado");
    const [description, setDescription] = useState("");

    const [goals, setGoals] = useState([]);
    const [goalId, setGoalId] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const categories = {
        income: ["Salário", "Freelancer", "PIX", "Venda", "Outro"],
        expense: ["Mercado", "Delivery", "Transporte", "Lazer", "Compras", "Outro"],
        saving: ["Reserva", "Investimento", "Viagem", "Emergência", "Outro"]
    };

    useEffect(() => {
        async function loadGoals() {
            try {
                const token = localStorage.getItem("cashbattle_token");

                const response = await api.get("/goals", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setGoals(response.data.goals || []);
            } catch (err) {
                console.error("Erro ao carregar objetivos:", err);
            }
        }

        loadGoals();
    }, []);

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

            await api.post(
                "/transactions",
                {
                    type,
                    amount: Number(amount),
                    category,
                    description,
                    goalId: type === "saving" ? goalId || null : null
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Não foi possível salvar a transação."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="transaction-page">
            <header className="transaction-header">
                <button onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={22} />
                </button>

                <div>
                    <span>CashBattle</span>
                    <h1>Nova transação</h1>
                </div>
            </header>

            <section className="type-selector">
                <button
                    type="button"
                    className={type === "income" ? "active" : ""}
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
                    className={type === "saving" ? "active" : ""}
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
                    {loading ? "Salvando..." : "Salvar transação"}
                </button>
            </form>
        </main>
    );
}

export default Transaction;