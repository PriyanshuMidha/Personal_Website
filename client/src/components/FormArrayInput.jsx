const FormArrayInput = ({ label, value = [], onChange, placeholder = "Add comma separated values" }) => (
  <label className="flex flex-col gap-2">
    <span className="text-sm text-text-secondary">{label}</span>
    <textarea
      rows={3}
      placeholder={placeholder}
      value={Array.isArray(value) ? value.join(", ") : ""}
      onChange={(event) =>
        onChange(
          event.target.value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      }
      className="rounded-2xl border border-border-soft bg-accent-surface px-4 py-3 text-text-primary outline-none transition focus:border-accent-primary focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
    />
  </label>
);

export default FormArrayInput;
