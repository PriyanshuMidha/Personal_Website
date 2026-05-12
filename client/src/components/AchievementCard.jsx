import StatusBadge from "./StatusBadge";

const AchievementCard = ({ achievement }) => (
  <div className="card-interactive p-6">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-label">{achievement.category || "Achievement"}</p>
        <h3 className="mt-2 font-display text-2xl text-text-primary">{achievement.title}</h3>
      </div>
      <div className="flex items-center gap-2">
        {achievement.isFeatured ? <StatusBadge tone="primary">Featured</StatusBadge> : null}
        {achievement.date ? <span className="text-sm text-text-muted">{new Date(achievement.date).getFullYear()}</span> : null}
      </div>
    </div>
    <p className="mt-4 text-sm leading-7 text-text-secondary">{achievement.description}</p>
    {achievement.impact ? <p className="mt-4 text-sm font-medium text-accent-green">{achievement.impact}</p> : null}
  </div>
);

export default AchievementCard;
