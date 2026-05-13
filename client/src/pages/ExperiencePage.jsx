import SectionHeader from "../components/SectionHeader";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import ExperienceTimeline from "../components/ExperienceTimeline";
import useAsyncData from "../hooks/useAsyncData";
import { publicApi } from "../api/publicApi";

const ExperiencePage = () => {
  const { data, loading, error } = useAsyncData(() => publicApi.getExperience(), [], {
    cacheKey: "public:experience",
    staleTime: 5 * 60 * 1000,
  });

  if (loading) return <Loader label="Loading experience..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">
      <SectionHeader title="Experience" description="Roles, responsibilities, and engineering delivery presented as an operational timeline." eyebrow="Timeline" />
      {(data || []).length ? <ExperienceTimeline items={data} /> : <EmptyState title="No experience entries published yet" />}
    </div>
  );
};

export default ExperiencePage;
