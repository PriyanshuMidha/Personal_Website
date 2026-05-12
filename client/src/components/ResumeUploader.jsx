import ImageUploader from "./ImageUploader";

const ResumeUploader = ({ onUploaded }) => (
  <ImageUploader
    label="Upload resume document"
    kind="resume"
    accept=".pdf,.doc,.docx"
    onUploaded={onUploaded}
  />
);

export default ResumeUploader;

