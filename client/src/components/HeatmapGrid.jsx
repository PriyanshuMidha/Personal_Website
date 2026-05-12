const intensityClasses = [
  "bg-white/[0.04]",
  "bg-accent-primary/35",
  "bg-accent-cyan/45",
  "bg-accent-green/55",
  "bg-accent-green",
];

const HeatmapGrid = ({ cells = [] }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1">
      {cells.map((cell) => (
        <div
          key={cell.date}
          title={`${cell.date}: ${cell.count} updates`}
          className={`aspect-square rounded-[4px] border border-black/10 ${intensityClasses[cell.intensity] || intensityClasses[0]}`}
        />
      ))}
    </div>
    <div className="flex items-center justify-end gap-2 text-xs text-text-muted">
      <span>Less</span>
      {intensityClasses.map((className, index) => (
        <span key={index} className={`h-3 w-3 rounded-[4px] ${className}`} />
      ))}
      <span>More</span>
    </div>
  </div>
);

export default HeatmapGrid;
