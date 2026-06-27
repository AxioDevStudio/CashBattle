import { Home, Trophy, Users, User } from "lucide-react";

function BottomNavigation() {
    return (
        <nav className="bottom-nav">
            <button className="active">
                <Home size={22} />
                <span>Home</span>
            </button>

            <button>
                <Trophy size={22} />
                <span>Ranking</span>
            </button>

            <div></div>

            <button>
                <Users size={22} />
                <span>Feed</span>
            </button>

            <button>
                <User size={22} />
                <span>Perfil</span>
            </button>
        </nav>
    );
}

export default BottomNavigation;