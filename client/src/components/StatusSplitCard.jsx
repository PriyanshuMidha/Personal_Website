const accentMap = {
  live: "bg-accent-green",
  inProgress: "bg-accent-cyan",
  archived: "bg-accent-red",
  featured: "bg-accent-primary",
};

const StatusSplitCard = ({ items = {} }) => {
  const entries = [
    { key: "live", label: "Live", value: items.live || 0 },
    { key: "inProgress", label: "In Progress", value: items.inProgress || 0 },
    { key: "archived", label: "Archived", value: items.archived || 0 },
    { key: "featured", label: "Featured", value: items.featured || 0 },
  ];

  const total = entries.reduce((sum, entry) => sum + entry.value, 0) || 1;

  return (
    <div className="space-y-4">
      <div className="flex h-3 overflow-hidden rounded-full bg-white/[0.05]">
        {entries.map((entry) => (
          <div
            key={entry.key}
            className={accentMap[entry.key]}
            style={{ width: `${(entry.value / total) * 100}%`, minWidth: entry.value ? "6%" : "0%" }}
          />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {entries.map((entry) => (
          <div key={entry.key} className="rounded-[18px] border border-border bg-panel px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{entry.label}</p>
            <p className="mt-2 font-display text-2xl text-text-primary">{entry.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusSplitCard;
