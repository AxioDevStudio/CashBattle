function ChartCard({ title, children }) {
    return (
        <section className="card">
            <h2>{title}</h2>
            {children}
        </section>
    );
}

export default ChartCard;
