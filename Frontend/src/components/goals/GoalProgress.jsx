function GoalProgress({ current = 0, target = 1 }) {
    const percent = Math.min((Number(current) / Number(target || 1)) * 100, 100);

    return (
        <>
            <div className="goal-mini-progress">
                <div style={{ width: `${percent}%` }}></div>
            </div>

            <span>{percent.toFixed(0)}%</span>
        </>
    );
}

export default GoalProgress;
