import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import MetricCard from "../components/MetricCard";
import { getUiPreferences, setUiPreferences } from "../utils/uiPreferences";
import BASE_URL from "../api/http";

const SettingsPage = ({ auth }) => {
  const [preferences, setPreferences] = useState(getUiPreferences());
  const [health, setHealth] = useState({ status: "Checking...", uptime: "" });

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const response = await fetch(`${BASE_URL.replace(/\/api$/, "")}/api/health`);
        const payload = await response.json();
        setHealth({
          status: payload.data?.mongodb?.status || payload.message || "Healthy",
          uptime: payload.data?.timestamp || `${Math.round(payload.data?.uptime || 0)}s uptime`,
        });
      } catch (_error) {
        setHealth({ status: "Unavailable", uptime: "Health endpoint not reachable" });
      }
    };

    loadHealth();
  }, []);

  const updatePreference = (key, value) => {
    const next = setUiPreferences({ [key]: value });
    setPreferences(next);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Settings"
        title="Workspace preferences"
        description="Tune local dashboard behavior and inspect a few read-only system details without changing backend contracts."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Auth Session" value={auth.admin?.name || "Admin"} helper={auth.admin?.email} />
        <MetricCard label="API Health" value={health.status} helper={health.uptime} />
        <MetricCard label="Density Mode" value={preferences.adminDensity} helper="Stored locally in the browser" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="shell space-y-5 p-6">
          <p className="text-label">Local preferences</p>
          <label className="flex items-center justify-between gap-4 rounded-2xl border border-border-soft bg-card px-4 py-4 text-sm text-text-secondary">
            <span>Collapse sidebar by default</span>
            <input
              type="checkbox"
              checked={Boolean(preferences.adminSidebarCollapsed)}
              onChange={(event) => updatePreference("adminSidebarCollapsed", event.target.checked)}
            />
          </label>

          <div className="rounded-2xl border border-border-soft bg-card p-4">
            <p className="text-sm text-text-secondary">Dashboard density</p>
            <div className="mt-3 flex gap-3">
              {["comfortable", "compact"].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updatePreference("adminDensity", value)}
                  className={`rounded-full px-4 py-2 text-sm ${
                    preferences.adminDensity === value ? "bg-accent-primary text-white" : "border border-border-soft text-text-secondary"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="shell space-y-5 p-6">
          <p className="text-label">System information</p>
          <div className="card-surface p-5">
            <p className="text-sm font-medium text-text-primary">API Base</p>
            <p className="mt-2 break-all text-sm text-text-secondary">{BASE_URL}</p>
          </div>
          <div className="card-surface p-5">
            <p className="text-sm font-medium text-text-primary">Authentication</p>
            <p className="mt-2 text-sm text-text-secondary">JWT-protected admin session with client-side token storage.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
