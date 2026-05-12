const ActivityFeedCard = ({ items = [] }) => (
  <div className="space-y-3">
    {items.map((item) => (
      <div key={item._id || `${item.module}-${item.createdAt}`} className="rounded-[18px] border border-border bg-panel px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-primary">{item.title}</p>
            <p className="mt-1 text-sm leading-6 text-text-secondary">{item.description}</p>
          </div>
          <span className="text-xs uppercase tracking-[0.18em] text-text-muted">{item.module}</span>
        </div>
        <p className="mt-3 text-xs text-text-muted">{new Date(item.createdAt).toLocaleString()}</p>
      </div>
    ))}
  </div>
);

export default ActivityFeedCard;
