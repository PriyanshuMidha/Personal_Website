import { useEffect, useState } from "react";

const parseArrayValue = (input) =>
  input
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

const serializeArrayValue = (items) => (Array.isArray(items) ? items.join(", ") : "");

const FormArrayInput = ({ label, value = [], onChange, placeholder = "Add comma-separated or line-separated values", helperText = "" }) => {
  const [draftValue, setDraftValue] = useState(serializeArrayValue(value));

  useEffect(() => {
    const nextSerialized = serializeArrayValue(value);
    const normalizedDraft = serializeArrayValue(parseArrayValue(draftValue));

    // Avoid wiping trailing commas/spaces/new lines while the user is typing.
    // Only sync from props when the incoming value is meaningfully different.
    if (nextSerialized !== normalizedDraft) {
      setDraftValue(nextSerialized);
    }
  }, [draftValue, value]);

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
