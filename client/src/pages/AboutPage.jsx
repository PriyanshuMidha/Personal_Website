import SectionHeader from "../components/SectionHeader";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import StatusBadge from "../components/StatusBadge";
import useAsyncData from "../hooks/useAsyncData";
import { publicApi } from "../api/publicApi";

const AboutPage = () => {
  const { data, loading, error } = useAsyncData(() => publicApi.getProfile(), [], {
    cacheKey: "public:profile",
    staleTime: 5 * 60 * 1000,
  });

  if (loading) return <Loader label="Loading profile..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">
      <SectionHeader title={data?.aboutTitle || "About me"} description={data?.subheadline || "Engineering with systems depth, clean implementation, and a product-aware lens."} eyebrow="Profile" />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="shell p-6">
          <p className="text-sm leading-8 text-text-secondary">{data?.about || data?.aboutDescription || data?.bio || "Add your story from the admin CMS."}</p>
        </div>
        <div className="grid gap-4">
          <div className="card-surface p-5">
            <p className="text-label">Location</p>
            <p className="mt-3 font-display text-2xl text-text-primary">{data?.location || "Not configured"}</p>
          </div>
          <div className="card-surface p-5">
            <p className="text-label">Current Role</p>
            <p className="mt-3 font-display text-2xl text-text-primary">{data?.currentRole || "Not configured"}</p>
            <p className="mt-2 text-sm text-text-secondary">{data?.currentCompany || "Current company not configured"}</p>
          </div>
          <div className="card-surface p-5">
            <p className="text-label">Specialties</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(data?.specialties || []).map((item) => (
                <StatusBadge key={item} tone="primary">{item}</StatusBadge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
