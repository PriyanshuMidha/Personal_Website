import { Link, Outlet, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Download } from "lucide-react";
import { publicNavLinks } from "../constants/site";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AppShell from "../components/AppShell";
import useAsyncData from "../hooks/useAsyncData";
import { publicApi } from "../api/publicApi";

const PublicLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profile = useAsyncData(() => publicApi.getProfile(), []);

  const currentLink = useMemo(
    () => publicNavLinks.find((link) => (link.path === "/" ? location.pathname === "/" : location.pathname.startsWith(link.path))),
    [location.pathname]
  );
  const githubUrl = profile.data?.githubUrl || "";
  const linkedinUrl = profile.data?.linkedinUrl || "";
  const resumeUrl = profile.data?.resumeUrl || "";

  return (
    <AppShell
      sidebar={
        <Sidebar
          links={publicNavLinks}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onToggle={() => setCollapsed((value) => !value)}
          brandTitle="Backend Engineer Workspace"
          brandSubtitle="Public Command Center"
          footer={
            <div className="card-surface p-4">
              <p className="text-label">Workspace status</p>
              {!collapsed ? <p className="mt-2 text-sm font-medium text-text-primary">Portfolio operating normally</p> : null}
              {!collapsed ? <p className="mt-1 text-xs leading-6 text-text-muted">Architecture notes, project depth, and delivery outcomes organized like a clean control room.</p> : null}
              <Link
                to="/cms"
                className={`mt-4 inline-flex items-center justify-center rounded-full border border-border-soft px-4 py-2 text-sm text-text-secondary hover:text-text-primary ${
                  collapsed ? "w-full px-2" : ""
                }`}
              >
                {collapsed ? "CMS" : "Admin CMS"}
              </Link>
            </div>
          }
        />
      }
      topbar={
        <Topbar
          title={currentLink?.label || "Overview"}
          subtitle={location.pathname === "/" ? "Backend Engineer Command Center" : "Public Workspace"}
          onOpenSidebar={() => setMobileOpen(true)}
          rightContent={
            <div className="hidden items-center gap-2 md:flex">
              {githubUrl ? (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-card p-2 text-text-secondary hover:text-text-primary">
                  <Github size={16} />
                </a>
              ) : null}
              {linkedinUrl ? (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-card p-2 text-text-secondary hover:text-text-primary">
                  <Linkedin size={16} />
                </a>
              ) : null}
              <a
                href={resumeUrl || "/resume"}
                target={resumeUrl ? "_blank" : undefined}
                rel={resumeUrl ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
              >
                <Download size={14} />
                Resume
              </a>
            </div>
          }
        />
      }
    >
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Outlet />
      </motion.div>
    </AppShell>
  );
};

export default PublicLayout;
