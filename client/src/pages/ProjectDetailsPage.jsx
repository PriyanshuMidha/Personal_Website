import { useParams } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import TechBadge from "../components/TechBadge";
import StatusBadge from "../components/StatusBadge";
import useAsyncData from "../hooks/useAsyncData";
import { publicApi } from "../api/publicApi";

const ProjectDetailsPage = () => {
  const { slug } = useParams();
  const { data, loading, error } = useAsyncData(() => publicApi.getProjectBySlug(slug), [slug]);

  if (loading) return <Loader label="Loading project details..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow={data?.category || "Project"} title={data?.title} description={data?.shortDescription} actions={<StatusBadge status={data?.status || "completed"} />} />
      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="space-y-6">
          <div className="shell p-6">
            <h3 className="font-display text-2xl text-text-primary">Overview</h3>
            <p className="mt-4 text-sm leading-8 text-text-secondary">{data?.longDescription || "Long description not added yet."}</p>
          </div>
          <div className="shell p-6">
            <h3 className="font-display text-2xl text-text-primary">Problem solved</h3>
            <p className="mt-4 text-sm leading-8 text-text-secondary">{data?.problemSolved || "Problem statement not added yet."}</p>
          </div>
          <div className="shell p-6">
            <h3 className="font-display text-2xl text-text-primary">Features</h3>
            <div className="mt-4 grid gap-3">
              {(data?.features || []).map((feature) => (
                <div key={feature} className="card-surface px-4 py-3 text-sm text-text-secondary">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="shell p-6">
            <p className="text-label">Tech stack</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(data?.techStack || []).map((tech) => (
                <TechBadge key={tech}>{tech}</TechBadge>
              ))}
            </div>
          </div>
          <div className="shell p-6">
            <p className="text-label">Links</p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              {data?.liveUrl ? <a href={data.liveUrl} target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:text-text-primary">Live application</a> : null}
              {data?.githubUrl ? <a href={data.githubUrl} target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:text-text-primary">Source repository</a> : null}
            </div>
          </div>
          {!!data?.screenshots?.length && (
            <div className="grid gap-4">
              {data.screenshots.map((shot) => (
                <img key={shot.url} src={shot.url} alt={shot.caption || data.title} className="rounded-[24px] border border-border-soft object-cover" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
