const PageHeader = ({ title, subtitle, description, actions }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div className="space-y-2">
      {subtitle ? <p className="text-label">{subtitle}</p> : null}
      <h1 className="font-display text-3xl tracking-tight text-text-primary md:text-4xl">{title}</h1>
      {description ? <p className="max-w-3xl text-sm leading-7 text-text-secondary md:text-base">{description}</p> : null}
    </div>
    {actions ? <div className="w-full md:w-auto md:self-start">{actions}</div> : null}
  </div>
);

export default PageHeader;
