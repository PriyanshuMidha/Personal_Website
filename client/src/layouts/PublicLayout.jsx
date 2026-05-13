import { Link, Outlet, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Globe, Code2, Download } from "lucide-react";
import { publicNavLinks } from "../constants/site";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AppShell from "../components/AppShell";
import useAsyncData from "../hooks/useAsyncData";
import { publicApi } from "../api/publicApi";

const socialIconMap = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  leetcode: Code2,
};

const PublicLayout = () => {
  const location = useLocation();
  const isHomeRoute = location.pathname === "/";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const publicData = useAsyncData(
    () => (isHomeRoute ? publicApi.getHome() : publicApi.getProfile()),
    [isHomeRoute],
    {
      cacheKey: isHomeRoute ? "public:home" : "public:profile",
      staleTime: 5 * 60 * 1000,
    }
  );

  const currentLink = useMemo(
    () => publicNavLinks.find((link) => (link.path === "/" ? location.pathname === "/" : location.pathname.startsWith(link.path))),
    [location.pathname]
  );
  const profile = isHomeRoute ? publicData.data?.profile : publicData.data;
  const displayName = profile?.fullName || profile?.name || "Priyanshu Midha";
  const githubUrl = profile?.githubUrl || "";
  const linkedinUrl = profile?.linkedinUrl || "";
  const instagramUrl = profile?.instagramUrl || "";
  const resumeUrl = profile?.resumeUrl || "";
  const customSocialLinks = (profile?.socialLinks || []).filter((link) => {
    const platform = String(link?.platform || "").toLowerCase();
    return link?.url && !["github", "linkedin", "instagram"].includes(platform);
  });

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
          title={isHomeRoute ? displayName : currentLink?.label || "Portfolio"}
          subtitle={isHomeRoute ? "Personal Portfolio" : "Public Workspace"}
          titleClassName={isHomeRoute ? "text-3xl md:text-4xl" : "text-2xl"}
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
              {instagramUrl ? (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-card p-2 text-text-secondary hover:text-text-primary">
                  <Instagram size={16} />
                </a>
              ) : null}
              {customSocialLinks.map((link, index) => {
                const platform = String(link?.platform || "").toLowerCase();
                const Icon = socialIconMap[platform] || Globe;

                return (
                  <a
                    key={`${link.platform}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.platform || "Social link"}
                    aria-label={link.platform || "Social link"}
                    className="rounded-xl border border-border bg-card p-2 text-text-secondary hover:text-text-primary"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
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
        <Outlet context={{ homeData: isHomeRoute ? publicData.data : null, homeLoading: isHomeRoute ? publicData.loading : false, homeError: isHomeRoute ? publicData.error : "" }} />
      </motion.div>
    </AppShell>
  );
};

export default PublicLayout;
