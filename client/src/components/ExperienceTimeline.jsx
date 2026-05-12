import TechBadge from "./TechBadge";
import StatusBadge from "./StatusBadge";

const ExperienceTimeline = ({ items = [] }) => (
  <div className="space-y-5">
    {items.map((item, index) => (
      <div key={item._id || item.company} className="relative grid gap-4 border-l border-border-soft pl-8 md:grid-cols-[200px_1fr]">
        <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-accent-primary" />
        <div className="text-sm text-text-muted">
          {new Date(item.startDate).getFullYear()} - {item.isCurrent ? "Present" : item.endDate ? new Date(item.endDate).getFullYear() : "Now"}
        </div>
        <div className={`card-surface p-6 ${index % 2 ? "bg-[#18191d]" : ""}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl text-text-primary">{item.role}</h3>
              <p className="mt-1 text-accent-cyan">{item.company}</p>
            </div>
            {item.isCurrent ? <StatusBadge tone="green">Current</StatusBadge> : null}
          </div>
          <p className="mt-3 text-sm leading-7 text-text-secondary">{item.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(item.techStack || []).map((tech) => (
              <TechBadge key={tech}>{tech}</TechBadge>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ExperienceTimeline;
