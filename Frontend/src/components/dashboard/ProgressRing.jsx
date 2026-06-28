function ProgressRing({ percentage = 0 }) {
    const value = Math.min(Math.max(Number(percentage), 0), 100);

    return (
        <div className="progress-ring">
            <span>{value.toFixed(0)}%</span>
        </div>
    );
}

export default ProgressRing;
