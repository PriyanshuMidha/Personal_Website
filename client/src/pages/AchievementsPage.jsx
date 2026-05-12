import SectionHeader from "../components/SectionHeader";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import AchievementCard from "../components/AchievementCard";
import useAsyncData from "../hooks/useAsyncData";
import { publicApi } from "../api/publicApi";

const AchievementsPage = () => {
  const { data, loading, error } = useAsyncData(() => publicApi.getAchievements(), []);

  if (loading) return <Loader label="Loading achievements..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">
      <SectionHeader title="Achievements" description="Impact-focused milestones, recognition, and measurable outcomes." eyebrow="Outcomes" />
      {(data || []).length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {data.map((achievement) => (
            <AchievementCard key={achievement._id} achievement={achievement} />
          ))}
        </div>
      ) : (
        <EmptyState title="No achievements published yet" />
      )}
    </div>
  );
};

export default AchievementsPage;
