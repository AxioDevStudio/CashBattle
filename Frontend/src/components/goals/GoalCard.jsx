import GoalProgress from "./GoalProgress";

function GoalCard({ goal }) {
    return (
        <article className="goal-item">
            <h3>{goal.title}</h3>
            <p>{goal.category || "Sem categoria"}</p>

            <strong>
                R$ {Number(goal.current_amount || 0).toFixed(2)} / R$ {Number(goal.target_amount || 0).toFixed(2)}
            </strong>

            <GoalProgress current={goal.current_amount} target={goal.target_amount} />
        </article>
    );
}

export default GoalCard;
