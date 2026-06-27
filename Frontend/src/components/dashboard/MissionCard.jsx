import { Check } from "lucide-react";

function MissionCard({ title, checked }) {
    return (
        <article className="mission-card">
            <div className={checked ? "mission-check checked" : "mission-check"}>
                {checked && <Check size={16} />}
            </div>

            <p>{title}</p>
        </article>
    );
}

export default MissionCard;