const EmptyState = ({ title = "Nothing here yet", description = "Content will appear once it is added." }) => (
  <div className="shell flex min-h-[180px] flex-col items-center justify-center gap-3 p-8 text-center">
    <p className="text-label">No data</p>
    <h3 className="font-display text-2xl text-text-primary">{title}</h3>
    <p className="max-w-md text-sm leading-7 text-text-secondary">{description}</p>
  </div>
);

export default EmptyState;
