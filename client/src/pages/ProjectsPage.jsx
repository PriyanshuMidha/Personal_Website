import SectionHeader from "../components/SectionHeader";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import ProjectCard from "../components/ProjectCard";
import useAsyncData from "../hooks/useAsyncData";
import { publicApi } from "../api/publicApi";

const ProjectsPage = () => {
  const { data, loading, error } = useAsyncData(() => publicApi.getProjects(), []);

  if (loading) return <Loader label="Loading projects..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">
      <SectionHeader title="Projects" description="A denser, dashboard-style index of engineering work, product builds, and systems-focused delivery." eyebrow="Work Index" />
      {(data || []).length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState title="No projects published yet" />
      )}
    </div>
  );
};

export default ProjectsPage;
