import StatusBadge from "./StatusBadge";

const SkillCard = ({ skill }) => (
  <div className="card-interactive p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-label">{skill.category || "Capability"}</p>
        <h3 className="mt-2 font-display text-xl text-text-primary">{skill.name}</h3>
      </div>
      {skill.level ? <StatusBadge tone="cyan">{skill.level}</StatusBadge> : null}
    </div>
  </div>
);

export default SkillCard;
