import { Plus } from "lucide-react";

function FloatingActionButton({ onClick }) {
    return (
        <button className="floating-button" onClick={onClick}>
            <Plus size={26} />
        </button>
    );
}

export default FloatingActionButton;
