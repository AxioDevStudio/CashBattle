function GoalForm({ title, targetAmount, category, setTitle, setTargetAmount, setCategory, onSubmit }) {
    return (
        <form className="goal-form" onSubmit={onSubmit}>
            <input
                placeholder="Ex: Notebook novo"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />

            <input
                type="number"
                placeholder="Valor alvo"
                value={targetAmount}
                onChange={(event) => setTargetAmount(event.target.value)}
            />

            <input
                placeholder="Categoria"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
            />

            <button>Criar objetivo</button>
        </form>
    );
}

export default GoalForm;
