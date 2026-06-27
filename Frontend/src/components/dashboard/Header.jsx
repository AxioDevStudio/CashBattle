import { Bell, Menu } from "lucide-react";

function Header({ userName }) {
    return (
        <header className="dashboard-header">
            <button>
                <Menu size={22} />
            </button>

            <div>
                <span>Boa tarde,</span>
                <h2>{userName}</h2>
            </div>

            <button>
                <Bell size={22} />
            </button>
        </header>
    );
}

export default Header;