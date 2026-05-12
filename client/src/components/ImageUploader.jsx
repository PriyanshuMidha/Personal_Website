import { useState } from "react";
import { adminApi } from "../api/adminApi";
import useToast from "../hooks/useToast";

const ImageUploader = ({ label = "Upload image", onUploaded, accept = "image/*", kind = "image" }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const response = kind === "resume" ? await adminApi.uploadResume(file) : await adminApi.uploadImage(file);
      onUploaded(response.data);
      toast.success(kind === "resume" ? "Resume uploaded successfully." : "File uploaded successfully.");
      event.target.value = "";
    } catch (uploadError) {
      const message = uploadError.message || "Upload failed";
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="card-surface block cursor-pointer p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-primary">{label}</p>
            <p className="mt-1 text-xs text-text-muted">{uploading ? "Uploading file..." : "Choose a file to upload."}</p>
          </div>
          <span className="rounded-full border border-accent-primary/20 bg-accent-primary/10 px-3 py-1 text-xs font-medium text-accent-primary">
            Browse
          </span>
        </div>
        <input type="file" accept={accept} onChange={handleChange} className="hidden" />
      </label>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
};

export default ImageUploader;
