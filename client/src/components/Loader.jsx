const Loader = ({ label = "Loading content..." }) => (
  <div className="shell flex min-h-[180px] items-center justify-center p-8">
    <div className="flex items-center gap-3 text-text-secondary">
      <span className="h-3 w-3 animate-pulse rounded-full bg-accent-primary" />
      <span>{label}</span>
    </div>
  </div>
);

export default Loader;
