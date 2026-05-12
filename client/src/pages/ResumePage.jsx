import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import SectionHeader from "../components/SectionHeader";
import useAsyncData from "../hooks/useAsyncData";
import { publicApi } from "../api/publicApi";

const ResumePage = () => {
  const { data, loading, error } = useAsyncData(() => publicApi.getProfile(), []);

  if (loading) return <Loader label="Loading resume..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">
      <SectionHeader title="Resume" description="A clean resume workspace managed directly from the CMS and served on demand." eyebrow="Document" />
      <div className="shell p-8">
        {data?.resumeUrl ? (
          <div className="space-y-5">
            <div className="card-surface p-5">
              <p className="text-sm font-medium text-text-primary">{data?.resume?.originalName || "Resume document"}</p>
              <p className="mt-2 text-sm text-text-secondary">Latest resume available for hiring managers, collaborators, and interview loops.</p>
            </div>
            <a href={data.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-accent-primary px-6 py-3 font-semibold text-white">
              Open resume
            </a>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">Resume not uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default ResumePage;
