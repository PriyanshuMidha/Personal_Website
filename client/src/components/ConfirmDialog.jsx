const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="shell w-full max-w-md p-6">
        <div className="space-y-3">
          <p className="text-label">Confirmation</p>
          <h3 className="font-display text-2xl text-text-primary">{title}</h3>
          <p className="text-sm leading-7 text-text-secondary">{description}</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-full border border-border-soft px-4 py-2 text-sm text-text-secondary">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className="rounded-full bg-accent-primary px-4 py-2 text-sm font-semibold text-white">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
