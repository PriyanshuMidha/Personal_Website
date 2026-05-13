import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import SectionHeader from "../components/SectionHeader";
import ResumeUploader from "../components/ResumeUploader";
import ConfirmDialog from "../components/ConfirmDialog";
import useToast from "../hooks/useToast";
import { invalidateCache } from "../utils/apiCache";

const formatResumeError = (error) => {
  if (error?.errors?.length) {
    return error.errors.map((entry) => `${entry.field}: ${entry.message}`).join(" | ");
  }

  return error?.message || "Unable to load resume data";
};

const ResumePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState(false);
  const toast = useToast();

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.getProfile();
      setProfile(response.data);
    } catch (loadError) {
      setError(formatResumeError(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) return <Loader label="Loading resume manager..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Resume"
        title="Resume workspace"
        description="Manage the current resume file used by the public portfolio and replace it whenever your experience changes."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="shell space-y-5 p-6">
          <p className="text-label">Upload controls</p>
          <ResumeUploader
            onUploaded={(nextProfile) => {
              setProfile(nextProfile);
              invalidateCache(["admin:dashboard:overview", "public:profile", "public:home"]);
            }}
          />
          <a href="/resume" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit rounded-full border border-border-soft px-4 py-2 text-sm text-text-secondary hover:text-text-primary">
            View public page
          </a>
          <button type="button" onClick={() => setRemoving(true)} disabled={!profile?.resume?.url && !profile?.resumeUrl} className="rounded-full border border-border-soft px-4 py-2 text-sm text-text-secondary disabled:opacity-50">
            {removing ? "Removing..." : "Remove current resume"}
          </button>
        </div>

        <div className="shell space-y-5 p-6">
          <p className="text-label">Current file</p>
          {profile?.resume?.url ? (
            <>
              <div className="card-surface p-5">
                <p className="text-sm font-medium text-text-primary">{profile.resume.originalName || "Resume document"}</p>
                <p className="mt-2 text-sm text-text-secondary">Uploaded asset ready for the public `/resume` page.</p>
              </div>
              <a href={profile.resume.url} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-accent-primary px-5 py-3 text-sm font-semibold text-white">
                Open resume
              </a>
            </>
          ) : profile?.resumeUrl ? (
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-accent-primary px-5 py-3 text-sm font-semibold text-white">
              Open resume
            </a>
          ) : (
            <p className="text-sm text-text-secondary">No resume uploaded yet.</p>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={removing}
        title="Remove resume?"
        description="This clears the resume from the public portfolio until a new document is uploaded."
        confirmLabel="Remove"
        onCancel={() => setRemoving(false)}
        onConfirm={async () => {
          try {
            setRemoving(true);
            const response = await adminApi.updateProfile({ ...profile, resume: null, resumeUrl: "" });
            setProfile(response.data);
            invalidateCache(["admin:dashboard:overview", "public:profile", "public:home"]);
            setRemoving(false);
            toast.success("Resume removed successfully.");
          } catch (removeError) {
            const message = formatResumeError(removeError);
            setError(message);
            toast.error(message);
            setRemoving(false);
          }
        }}
      />
    </div>
  );
};

export default ResumePage;
