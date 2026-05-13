import { useEffect, useState } from "react";

const parseArrayValue = (input) =>
  input
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

const FormArrayInput = ({ label, value = [], onChange, placeholder = "Add comma-separated or line-separated values", helperText = "" }) => {
  const [draftValue, setDraftValue] = useState(Array.isArray(value) ? value.join(", ") : "");

  useEffect(() => {
    setDraftValue(Array.isArray(value) ? value.join(", ") : "");
  }, [value]);

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm text-text-secondary">{label}</span>
      <textarea
        rows={3}
        placeholder={placeholder}
        value={draftValue}
        onChange={(event) => {
          const nextValue = event.target.value;
          setDraftValue(nextValue);
          onChange(parseArrayValue(nextValue));
        }}
        className="rounded-2xl border border-border-soft bg-accent-surface px-4 py-3 text-text-primary outline-none transition focus:border-accent-primary focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
      />
      {helperText ? <span className="text-xs text-text-muted">{helperText}</span> : null}
    </label>
  );
};

export default FormArrayInput;
