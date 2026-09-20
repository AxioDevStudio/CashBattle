import { Wallet, ListChecks } from "lucide-react";

function QuickActions({ onTransaction, onGoals }) {
    return (
        <section className="quick-actions-minimal">
            <button onClick={onTransaction}>
                <Wallet size={20} />
                Nova transação
            </button>

            <button onClick={onGoals}>
                <ListChecks size={20} />
                Ver objetivos
            </button>
        </section>
    );
}

export default QuickActions;
