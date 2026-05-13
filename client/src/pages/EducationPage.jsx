import SectionHeader from "../components/SectionHeader";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import TechBadge from "../components/TechBadge";
import useAsyncData from "../hooks/useAsyncData";
import { publicApi } from "../api/publicApi";

const EducationPage = () => {
  const { data, loading, error } = useAsyncData(() => publicApi.getEducation(), [], {
    cacheKey: "public:education",
    staleTime: 5 * 60 * 1000,
  });

  if (loading) return <Loader label="Loading education..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">
      <SectionHeader title="Education" description="Academic foundation presented as clean dashboard panels with coursework detail." eyebrow="Foundation" />
      {(data || []).length ? (
        <div className="grid gap-5">
          {data.map((item) => (
            <div key={item._id} className="shell p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-display text-2xl text-text-primary">{item.degree}</h3>
                  <p className="mt-2 text-accent-cyan">{item.institution}</p>
                </div>
                <p className="text-sm text-text-muted">
                  {item.startYear} - {item.endYear || "Present"}
                </p>
              </div>
              <p className="mt-4 text-sm leading-7 text-text-secondary">{item.description}</p>
              {(item.coursework || []).length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.coursework.map((course) => (
                    <TechBadge key={course}>{course}</TechBadge>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No education details published yet" />
      )}
    </div>
  );
};

export default EducationPage;
