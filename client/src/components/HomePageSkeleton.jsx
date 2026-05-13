const SkeletonBlock = ({ className = "" }) => <div className={`animate-pulse rounded-[24px] bg-white/[0.05] ${className}`} />;

const HomePageSkeleton = () => (
  <div className="space-y-6">
    <div className="shell space-y-4 p-6">
      <SkeletonBlock className="h-4 w-32" />
      <SkeletonBlock className="h-12 w-56" />
      <SkeletonBlock className="h-5 w-full max-w-3xl" />
      <div className="flex flex-wrap gap-3 pt-2">
        <SkeletonBlock className="h-12 w-44 rounded-full" />
        <SkeletonBlock className="h-12 w-40 rounded-full" />
      </div>
    </div>

    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="shell space-y-4 p-6">
        <SkeletonBlock className="h-6 w-48" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="shell space-y-4 p-5">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-10 w-24" />
            <SkeletonBlock className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="shell space-y-4 p-5">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-8 w-40" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  </div>
);

export default HomePageSkeleton;
