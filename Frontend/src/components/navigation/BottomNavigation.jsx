import { Home, Target, Plus, BarChart3, User } from "lucide-react";

function BottomNavigation({ onNavigate }) {
    return (
        <nav className="bottom-nav">
            <button onClick={() => onNavigate("/dashboard")}>
                <Home size={22} />
                <span>Home</span>
            </button>

            <button onClick={() => onNavigate("/goals")}>
                <Target size={22} />
                <span>Metas</span>
            </button>

            <button className="bottom-nav-main" onClick={() => onNavigate("/transaction")}>
                <Plus size={24} />
            </button>

            <button onClick={() => onNavigate("/statistics")}>
                <BarChart3 size={22} />
                <span>Stats</span>
            </button>

            <button onClick={() => onNavigate("/profile")}>
                <User size={22} />
                <span>Perfil</span>
            </button>
        </nav>
    );
}

export default BottomNavigation;
