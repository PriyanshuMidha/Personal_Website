const DashboardCard = ({ title, eyebrow, description, actions, children, className = "" }) => (
  <section className={`card-surface p-5 md:p-6 ${className}`.trim()}>
    {(title || eyebrow || description || actions) ? (
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          {eyebrow ? <p className="text-label">{eyebrow}</p> : null}
          {title ? <h2 className="font-display text-2xl text-text-primary">{title}</h2> : null}
          {description ? <p className="max-w-2xl text-sm leading-7 text-text-secondary">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    ) : null}
    {children}
  </section>
);

export default DashboardCard;
