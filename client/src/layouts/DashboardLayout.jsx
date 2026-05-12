import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AppShell from "../components/AppShell";
import { adminLinks } from "../constants/site";
import { getUiPreferences, setUiPreferences } from "../utils/uiPreferences";

const DashboardLayout = ({ auth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPreferences = getUiPreferences();
  const [collapsed, setCollapsed] = useState(initialPreferences.adminSidebarCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLink = useMemo(
    () =>
      adminLinks.find((link) =>
        link.path === "/admin/dashboard"
          ? location.pathname === "/admin" || location.pathname === "/admin/dashboard"
          : location.pathname === link.path || location.pathname.startsWith(`${link.path}/`)
      ),
    [location.pathname]
  );

  return (
    <AppShell
      sidebar={
        <Sidebar
          links={adminLinks}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onToggle={() => {
            const next = !collapsed;
            setCollapsed(next);
            setUiPreferences({ adminSidebarCollapsed: next });
          }}
          brandTitle="Admin Command Center"
          brandSubtitle="Portfolio CMS"
          footer={
            <div className="card-surface p-4">
              <p className="text-label">Signed in</p>
              {!collapsed ? (
                <>
                  <p className="mt-2 text-sm font-medium text-text-primary">{auth.admin?.name || "Portfolio Admin"}</p>
                  <p className="mt-1 text-xs text-text-muted">{auth.admin?.email}</p>
                  <button
                    type="button"
                    onClick={() => {
                      auth.logout();
                      navigate("/admin/login");
                    }}
                    className="mt-4 w-full rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition hover:border-accent-primary hover:text-text-primary"
                  >
                    Logout
                  </button>
                </>
              ) : null}
            </div>
          }
        />
      }
      topbar={
        <Topbar
          title={currentLink?.label || "Overview"}
          subtitle="Admin Command Center"
          onOpenSidebar={() => setMobileOpen(true)}
          rightContent={
            <div className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm text-text-secondary md:block">
              {auth.admin?.email}
            </div>
          }
        />
      }
    >
      <Outlet />
    </AppShell>
  );
};

export default DashboardLayout;
