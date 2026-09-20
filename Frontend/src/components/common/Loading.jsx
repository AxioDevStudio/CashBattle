function Loading({ text = "Carregando..." }) {
    return (
        <main className="page">
            <p className="text-muted">{text}</p>
        </main>
    );
}

export default Loading;
