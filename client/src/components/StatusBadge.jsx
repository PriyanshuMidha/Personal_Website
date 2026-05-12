const toneClasses = {
  primary: "border-accent-primary/30 bg-accent-primary/10 text-accent-primary",
  green: "border-accent-green/30 bg-accent-green/10 text-accent-green",
  cyan: "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan",
  muted: "border-border-soft bg-accent-surface text-text-secondary",
  warning: "border-accent-yellow/25 bg-accent-yellow/10 text-accent-yellow",
  danger: "border-accent-red/25 bg-accent-red/10 text-accent-red",
};

const statusToneMap = {
  published: "green",
  featured: "primary",
  draft: "muted",
  completed: "green",
  active: "green",
  live: "green",
  "in progress": "warning",
  archived: "muted",
  new: "primary",
  read: "cyan",
  replied: "green",
  unread: "danger",
};

const StatusBadge = ({ children, tone = "muted", status }) => {
  const resolvedTone = status ? statusToneMap[String(status).toLowerCase()] || tone : tone;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${toneClasses[resolvedTone] || toneClasses.muted}`}>
      {children || status}
    </span>
  );
};

export default StatusBadge;
