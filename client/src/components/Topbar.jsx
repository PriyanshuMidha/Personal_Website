import { Menu } from "lucide-react";

const Topbar = ({ title, subtitle, onOpenSidebar, rightContent, titleClassName = "text-2xl" }) => (
  <header className="sticky top-0 z-30 border-b border-border/80 bg-panel/95 backdrop-blur">
    <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onOpenSidebar} className="rounded-xl border border-border bg-card p-2 text-text-secondary lg:hidden">
          <Menu size={18} />
        </button>
        <div>
          <p className="text-label">{subtitle}</p>
          <h2 className={`font-display text-text-primary ${titleClassName}`}>{title}</h2>
        </div>
      </div>
      <div className="flex items-center gap-3">{rightContent}</div>
    </div>
  </header>
);

export default Topbar;
