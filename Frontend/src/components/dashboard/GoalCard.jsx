function GoalCard({ title, mode }) {
    return (
        <section className="clean-goal-card">
            <div>
                <p>Objetivo atual</p>
                <h3>{title || "Não definido"}</h3>
            </div>

            <span>{mode}</span>
        </section>
    );
}

export default GoalCard;
