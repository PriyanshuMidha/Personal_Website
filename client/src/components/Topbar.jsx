import { Menu, Bell, Activity, Share2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

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
      <div className="flex items-center gap-3">
        <StatusBadge tone="cyan">
          <Activity className="mr-1 h-3.5 w-3.5" />
          Live workspace
        </StatusBadge>
        <button type="button" className="rounded-xl border border-border bg-card p-2 text-text-secondary hover:text-text-primary">
          <Bell size={16} />
        </button>
        <button type="button" className="hidden rounded-xl border border-border bg-card p-2 text-text-secondary hover:text-text-primary md:inline-flex">
          <Share2 size={16} />
        </button>
        {rightContent}
      </div>
    </div>
  </header>
);

export default Topbar;
