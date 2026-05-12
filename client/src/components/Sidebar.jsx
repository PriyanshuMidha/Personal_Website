import { NavLink } from "react-router-dom";
import { LayoutDashboard, UserRound, FolderKanban, BriefcaseBusiness, Trophy, BrainCircuit, GraduationCap, Mail, FileText, Settings, ChevronLeft, Menu, ContactRound, CircleEllipsis, PanelsTopLeft, Shield } from "lucide-react";

const iconMap = {
  Overview: LayoutDashboard,
  Dashboard: LayoutDashboard,
  About: UserRound,
  Profile: UserRound,
  Projects: FolderKanban,
  Experience: BriefcaseBusiness,
  Achievements: Trophy,
  Skills: BrainCircuit,
  Education: GraduationCap,
  Contact: ContactRound,
  Messages: Mail,
  Resume: FileText,
  "Admin CMS": Shield,
  Settings: Settings,
};

const groupLinks = (links) =>
  links.reduce((sections, link) => {
    const key = link.section || "Navigation";
    sections[key] = sections[key] || [];
    sections[key].push(link);
    return sections;
  }, {});

const Sidebar = ({ links, collapsed, onToggle, mobileOpen, onClose, footer, brandTitle = "Developer Control Room", brandSubtitle = "Portfolio OS" }) => {
  const sections = groupLinks(links);
  const content = (
    <div className="flex h-full flex-col gap-5 bg-sidebar p-4">
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card">
            <PanelsTopLeft size={18} className="text-text-primary" />
          </div>
          <div className={collapsed ? "hidden" : "block"}>
            <p className="text-label">{brandSubtitle}</p>
            <h1 className="mt-1 font-display text-lg text-text-primary">{brandTitle}</h1>
          </div>
        </div>
        <button type="button" onClick={onToggle} className="rounded-xl border border-border bg-card p-2 text-text-secondary hover:text-text-primary">
          {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      <nav className="space-y-4">
        {Object.entries(sections).map(([sectionName, sectionLinks]) => (
          <div key={sectionName}>
            {!collapsed ? <p className="sidebar-section-label">{sectionName}</p> : null}
            <div className="space-y-1">
              {sectionLinks.map((link) => {
                const Icon = iconMap[link.label] || CircleEllipsis;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === "/admin/dashboard" || link.path === "/"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${
                        isActive
                          ? "bg-white/[0.05] text-text-primary shadow-[inset_0_0_0_1px_rgba(167,139,250,0.22)]"
                          : "text-text-secondary hover:bg-white/[0.03] hover:text-text-primary"
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span className={collapsed ? "hidden" : "inline"}>{link.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-auto">{footer}</div>
    </div>
  );

  return (
    <>
      <aside className={`hidden border-r border-border/80 bg-sidebar lg:block ${collapsed ? "w-[92px]" : "w-[320px]"}`}>{content}</aside>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button type="button" className="flex-1 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <aside className="h-full w-[320px] border-l border-border bg-sidebar">{content}</aside>
        </div>
      ) : null}
    </>
  );
};

export default Sidebar;
