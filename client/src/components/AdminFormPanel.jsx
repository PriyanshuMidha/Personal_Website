const AdminFormPanel = ({ title, description, children, actions }) => (
  <section className="shell p-6">
    {(title || description || actions) ? (
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          {title ? <h2 className="font-display text-2xl text-text-primary">{title}</h2> : null}
          {description ? <p className="max-w-2xl text-sm leading-7 text-text-secondary">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    ) : null}
    {children}
  </section>
);

export default AdminFormPanel;
