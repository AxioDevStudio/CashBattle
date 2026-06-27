import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/goals.css";

function Goals() {
    const [goals, setGoals] = useState([]);
    const [title, setTitle] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [category, setCategory] = useState("");

    async function loadGoals() {
        const token = localStorage.getItem("cashbattle_token");

        const response = await api.get("/goals", {
            headers: { Authorization: `Bearer ${token}` }
        });

        setGoals(response.data.goals);
    }

    async function handleCreate(e) {
        e.preventDefault();

        const token = localStorage.getItem("cashbattle_token");

        await api.post(
            "/goals",
            {
                title,
                targetAmount: Number(targetAmount),
                category
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        setTitle("");
        setTargetAmount("");
        setCategory("");

        loadGoals();
    }

    useEffect(() => {
        loadGoals();
    }, []);

    return (
        <main className="goals-page">
            <h1>Objetivos</h1>

            <form className="goal-form" onSubmit={handleCreate}>
                <input
                    placeholder="Ex: Notebook novo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Valor alvo"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                />

                <input
                    placeholder="Categoria"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <button>Criar objetivo</button>
            </form>

            <section className="goals-list">
                {goals.map((goal) => {
                    const percent = Math.min(
                        (Number(goal.current_amount) / Number(goal.target_amount)) * 100,
                        100
                    );

                    return (
                        <article key={goal.id} className="goal-item">
                            <h3>{goal.title}</h3>
                            <p>{goal.category || "Sem categoria"}</p>

                            <strong>
                                R$ {Number(goal.current_amount).toFixed(2)} / R$ {Number(goal.target_amount).toFixed(2)}
                            </strong>

                            <div className="goal-mini-progress">
                                <div style={{ width: `${percent}%` }}></div>
                            </div>

                            <span>{percent.toFixed(0)}%</span>
                        </article>
                    );
                })}
            </section>
        </main>
    );
}

export default Goals;