const TopicProgressList = ({ items = [] }) => (
  <div className="space-y-4">
    {items.map((item) => (
      <div key={item.topic} className="space-y-2">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-text-primary">{item.topic}</span>
          <span className="text-text-secondary">{item.count} skills</span>
        </div>
        <div className="metric-strip">
          <div className="h-full rounded-full bg-accent-cyan" style={{ width: `${Math.max(item.percentage || 0, item.count ? 6 : 0)}%` }} />
        </div>
      </div>
    ))}
  </div>
);

export default TopicProgressList;
