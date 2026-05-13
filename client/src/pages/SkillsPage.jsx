import SectionHeader from "../components/SectionHeader";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import SkillCard from "../components/SkillCard";
import useAsyncData from "../hooks/useAsyncData";
import { publicApi } from "../api/publicApi";

const SkillsPage = () => {
  const { data, loading, error } = useAsyncData(() => publicApi.getSkills(), [], {
    cacheKey: "public:skills",
    staleTime: 5 * 60 * 1000,
  });

  if (loading) return <Loader label="Loading skills..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">
      <SectionHeader title="Skills" description="Technical capabilities arranged as a backend engineer’s operating stack." eyebrow="Capability Grid" />
      {(data || []).length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((skill) => (
            <SkillCard key={skill._id} skill={skill} />
          ))}
        </div>
      ) : (
        <EmptyState title="No skills published yet" />
      )}
    </div>
  );
};

export default SkillsPage;
