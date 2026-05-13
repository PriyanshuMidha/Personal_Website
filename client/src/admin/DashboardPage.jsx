import { Link } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import useAsyncData from "../hooks/useAsyncData";
import { adminApi } from "../api/adminApi";
import MetricCard from "../components/MetricCard";
import PageHeader from "../components/PageHeader";
import DashboardCard from "../components/DashboardCard";
import AdminDataTable from "../components/AdminDataTable";
import StatusBadge from "../components/StatusBadge";
import QuickActionCard from "../components/QuickActionCard";
import ProgressRing from "../components/ProgressRing";
import TopicProgressList from "../components/TopicProgressList";
import StatusSplitCard from "../components/StatusSplitCard";
import HeatmapGrid from "../components/HeatmapGrid";
import AdminDashboardSkeleton from "../components/AdminDashboardSkeleton";

const DashboardPage = () => {
  const { data, loading, error } = useAsyncData(() => adminApi.getDashboardOverview(), [], {
    cacheKey: "admin:dashboard:overview",
    staleTime: 60 * 1000,
  });

  if (loading) return <AdminDashboardSkeleton />;
  if (error) return <ErrorState message={error} />;

  const stats = {
    totalProjects: data?.totalProjects || 0,
    featuredProjects: data?.featuredProjects || 0,
    totalSkills: data?.totalSkills || 0,
    unreadMessages: data?.unreadMessages || 0,
  };
  const widgets = data || {};
  const metricCards = [
    { label: "Total Projects", value: stats.totalProjects, helper: "All portfolio builds tracked", accent: "primary", progress: 68 },
    { label: "Featured Projects", value: stats.featuredProjects, helper: "Shown in public spotlight", accent: "cyan", progress: 42 },
    { label: "Total Skills", value: stats.totalSkills, helper: "Published backend and tool skills", accent: "green", progress: 74 },
    { label: "Unread Messages", value: stats.unreadMessages, helper: "Inbound messages awaiting triage", accent: "yellow", trend: "Needs review", progress: 53 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        subtitle="Admin Command Center"
        description="Monitor portfolio content, inbound messages, publishing activity, and quick actions from a CMS workspace designed like a premium control room."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr_1fr]">
        <DashboardCard title="Portfolio Completion" eyebrow="Progress Ring" description="Tracks how complete the portfolio CMS is right now.">
          <ProgressRing
            value={widgets.portfolioCompletion?.percentage || 0}
            sublabel={`${widgets.portfolioCompletion?.completed || 0} of ${widgets.portfolioCompletion?.total || 0} core setup checkpoints complete`}
          />
        </DashboardCard>
        <DashboardCard title="Skill Topic Progress" eyebrow="Capability Depth" description="LeetCode-inspired topic coverage across your backend stack.">
          <TopicProgressList items={widgets.topicProgress || []} />
        </DashboardCard>
        <DashboardCard title="Project Status Split" eyebrow="Build State" description="How current portfolio work is distributed across delivery states.">
          <StatusSplitCard items={widgets.projectStatus || {}} />
        </DashboardCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardCard
          title="Workspace Activity"
          eyebrow="Overview Surface"
          description="A dense command-center summary of content, updates, and current publishing state."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[20px] border border-border bg-panel p-4">
              <p className="text-label">Project Coverage</p>
              <p className="mt-3 font-display text-3xl text-text-primary">{stats.totalProjects}</p>
              <div className="metric-strip">
                <div className="h-full w-[72%] rounded-full bg-accent-primary" />
              </div>
              <p className="mt-3 text-sm leading-7 text-text-secondary">Published and draft portfolio builds tracked from one workspace.</p>
            </div>
            <div className="rounded-[20px] border border-border bg-panel p-4">
              <p className="text-label">Inbox Pressure</p>
              <p className="mt-3 font-display text-3xl text-text-primary">{stats.unreadMessages}</p>
              <div className="metric-strip">
                <div className="h-full w-[48%] rounded-full bg-accent-yellow" />
              </div>
              <p className="mt-3 text-sm leading-7 text-text-secondary">Unread message volume and inbound communication needing attention.</p>
            </div>
            <div className="rounded-[20px] border border-border bg-panel p-4">
              <p className="text-label">Skill Surface</p>
              <p className="mt-3 font-display text-3xl text-text-primary">{stats.totalSkills}</p>
              <div className="metric-strip">
                <div className="h-full w-[81%] rounded-full bg-accent-green" />
              </div>
              <p className="mt-3 text-sm leading-7 text-text-secondary">Publicly visible capabilities currently represented in the portfolio.</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Recently Updated Projects" eyebrow="Content Activity" description="The most recently touched portfolio projects.">
          <div className="space-y-3">
            {(data?.recentProjects || []).map((project) => (
              <div key={project._id} className="rounded-[20px] border border-border bg-panel p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{project.title}</p>
                    <p className="mt-1 text-xs text-text-muted">{project.category || "Project"} · updated {new Date(project.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.isFeatured ? <StatusBadge tone="primary">Featured</StatusBadge> : null}
                    <StatusBadge status={project.isPublished ? "published" : "draft"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardCard title="Recent Messages" eyebrow="Inbox" description="The latest contact activity entering the CMS.">
          <AdminDataTable
            dense
            columns={[
              { key: "name", label: "Name" },
              { key: "subject", label: "Subject" },
              { key: "status", label: "Status", render: (value) => <StatusBadge status={value} /> },
              {
                key: "createdAt",
                label: "Received",
                render: (value) => new Date(value).toLocaleDateString(),
              },
            ]}
            rows={data?.recentMessages || []}
            emptyTitle="No recent messages"
            emptyDescription="New contact messages will appear here once the public inbox starts receiving traffic."
          />
        </DashboardCard>

        <DashboardCard title="Impact Stats" eyebrow="Totals" description="Operational totals that update as you add and publish content.">
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Projects Built" value={widgets.impactStats?.projectsBuilt || 0} helper="Portfolio builds" accent="primary" progress={70} />
            <MetricCard label="Skills Added" value={widgets.impactStats?.skillsAdded || 0} helper="Tracked capabilities" accent="cyan" progress={62} />
            <MetricCard label="Achievements Added" value={widgets.impactStats?.achievementsAdded || 0} helper="Impact entries" accent="green" progress={58} />
            <MetricCard label="Experience Entries" value={widgets.impactStats?.experienceEntries || 0} helper="Career timeline items" accent="yellow" progress={54} />
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <DashboardCard title="Activity Heatmap" eyebrow="CMS Updates" description="Recent admin changes rendered as a daily activity grid.">
          <HeatmapGrid cells={widgets.heatmap || []} />
        </DashboardCard>

        <DashboardCard title="Recent Activity" eyebrow="Activity Feed" description="The latest five CMS events in a compact admin-only feed.">
          <div className="space-y-3">
            {(widgets.activity || []).slice(0, 5).map((item) => (
              <div key={item._id || `${item.module}-${item.updatedAt || item.createdAt}`} className="rounded-[18px] border border-border bg-panel px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">{item.title}</p>
                    <p className="mt-1 truncate text-xs text-text-muted">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">{item.module}</p>
                    <p className="mt-1 text-xs text-text-muted">{new Date(item.updatedAt || item.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <DashboardCard title="Quick Actions" eyebrow="Fast Paths" description="Jump back into the most common content operations.">
          <div className="grid gap-4">
            {[
              {
                id: "projects",
                label: "Manage Projects",
                description: "Create, update, feature, and publish portfolio projects.",
                href: "/admin/projects",
              },
              {
                id: "profile",
                label: "Update Profile",
                description: "Edit public identity, social links, and primary portfolio copy.",
                href: "/admin/profile",
              },
              {
                id: "messages",
                label: "Review Inbox",
                description: "Check incoming contact messages and update their status.",
                href: "/admin/messages",
              },
              {
                id: "resume",
                label: "Manage Resume",
                description: "Upload or replace the current public resume document.",
                href: "/admin/resume",
              },
            ].map((action, index) => (
              <QuickActionCard
                key={action.id}
                title={action.label}
                description={action.description}
                href={action.href}
                accent={["purple", "cyan", "green", "yellow"][index % 4]}
              />
            ))}
          </div>
        </DashboardCard>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <DashboardCard title="System Context" eyebrow="Workspace" description="Useful runtime and delivery context for the current admin session.">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard label="Auth Mode" value="JWT" helper="Protected admin workspace" accent="primary" progress={65} />
            <MetricCard label="Content Modules" value={6} helper="Managed content collections" accent="cyan" progress={85} />
            <MetricCard label="Uploads" value={2} helper="Image and resume pipelines" accent="green" progress={50} />
          </div>
        </DashboardCard>
        <DashboardCard title="Open Surfaces" eyebrow="Navigation" description="Most-used dashboard routes for day-to-day maintenance.">
          <div className="grid gap-3">
            <Link to="/admin/profile" className="rounded-[18px] border border-border bg-panel px-4 py-3 text-sm text-text-secondary transition hover:text-text-primary">
              Update profile and social links
            </Link>
            <Link to="/admin/projects" className="rounded-[18px] border border-border bg-panel px-4 py-3 text-sm text-text-secondary transition hover:text-text-primary">
              Manage project catalog
            </Link>
            <Link to="/admin/messages" className="rounded-[18px] border border-border bg-panel px-4 py-3 text-sm text-text-secondary transition hover:text-text-primary">
              Review contact inbox
            </Link>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default DashboardPage;
