function AchievementCard({ achievement }) {
    return (
        <article className={achievement.unlocked ? "achievement unlocked" : "achievement"}>
            <div>{achievement.unlocked ? "✓" : "○"}</div>

            <section>
                <span>{achievement.title}</span>
                <p>{achievement.description}</p>
            </section>
        </article>
    );
}

export default AchievementCard;
