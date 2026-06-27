function ProgressRing({ percentage }) {
    const radius = 48;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset =
        circumference - (percentage / 100) * circumference;

    return (
        <div className="progress-ring">
            <svg height={radius * 2} width={radius * 2}>
                <circle
                    stroke="#2a2f3a"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />

                <circle
                    stroke="#d4af37"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>

            <strong>{percentage.toFixed(0)}%</strong>
        </div>
    );
}

export default ProgressRing;