const SkeletonBlock = ({ className = "" }) => <div className={`animate-pulse rounded-[22px] bg-white/[0.05] ${className}`} />;

const AdminDashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="shell space-y-4 p-6">
      <SkeletonBlock className="h-4 w-40" />
      <SkeletonBlock className="h-12 w-52" />
      <SkeletonBlock className="h-5 w-full max-w-3xl" />
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="shell space-y-4 p-5">
          <SkeletonBlock className="h-4 w-28" />
          <SkeletonBlock className="h-10 w-24" />
          <SkeletonBlock className="h-3 w-full" />
        </div>
      ))}
    </div>

    <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr_1fr]">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="shell space-y-4 p-6">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-40 w-full" />
        </div>
      ))}
    </div>

    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="shell space-y-4 p-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-24 w-full" />
        ))}
      </div>
      <div className="shell space-y-4 p-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-20 w-full" />
        ))}
      </div>
    </div>
  </div>
);

export default AdminDashboardSkeleton;
