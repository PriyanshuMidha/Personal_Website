const FormInput = ({ label, className = "", ...props }) => (
  <label className={`flex flex-col gap-2 ${className}`}>
    <span className="text-sm text-text-secondary">{label}</span>
    <input
      {...props}
      className="rounded-2xl border border-border-soft bg-accent-surface px-4 py-3 text-text-primary outline-none ring-0 transition focus:border-accent-primary focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
    />
  </label>
);

export default FormInput;
