import { Star, Trophy, Flame } from "lucide-react";

function StatsGrid({ user }) {
    return (
        <section className="profile-stats">
            <article>
                <Star size={20} />
                <span>XP</span>
                <strong>{user?.xp || 0}</strong>
            </article>

            <article>
                <Trophy size={20} />
                <span>Nível</span>
                <strong>{user?.level || 1}</strong>
            </article>

            <article>
                <Flame size={20} />
                <span>Streak</span>
                <strong>{user?.streak || 0}</strong>
            </article>
        </section>
    );
}

export default StatsGrid;
