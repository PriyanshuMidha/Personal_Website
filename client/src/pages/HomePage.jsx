import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import ProjectCard from "../components/ProjectCard";
import AchievementCard from "../components/AchievementCard";
import SkillCard from "../components/SkillCard";
import ExperienceTimeline from "../components/ExperienceTimeline";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import DashboardCard from "../components/DashboardCard";
import QuickActionCard from "../components/QuickActionCard";
import ProgressRing from "../components/ProgressRing";
import TopicProgressList from "../components/TopicProgressList";
import StatusSplitCard from "../components/StatusSplitCard";
import useAsyncData from "../hooks/useAsyncData";
import { publicApi } from "../api/publicApi";

const HomePage = () => {
  const profile = useAsyncData(() => publicApi.getProfile(), []);
  const featuredProjects = useAsyncData(() => publicApi.getFeaturedProjects(), []);
  const projects = useAsyncData(() => publicApi.getProjects(), []);
  const achievements = useAsyncData(() => publicApi.getAchievements(), []);
  const skills = useAsyncData(() => publicApi.getSkills(), []);
  const experience = useAsyncData(() => publicApi.getExperience(), []);
  const dashboardStats = useAsyncData(() => publicApi.getDashboardStats(), []);

  if ([profile, featuredProjects, projects, achievements, skills, experience, dashboardStats].some((entry) => entry.loading)) {
    return <Loader label="Loading control-room homepage..." />;
  }

  if (profile.error) return <ErrorState message={profile.error} />;
  if (dashboardStats.error) return <ErrorState message={dashboardStats.error} />;

  const statsPayload = dashboardStats.data || {};
  const firstLiveProject = (featuredProjects.data || projects.data || []).find((project) => project.liveUrl);
  const quickActions = [
    profile.data?.githubUrl
      ? {
          title: "View GitHub",
          description: "Inspect repositories, architecture decisions, and implementation detail.",
          href: profile.data.githubUrl,
          external: true,
          accent: "purple",
        }
      : null,
    firstLiveProject?.liveUrl
      ? {
          title: "Open Live Project",
          description: "Jump straight into a published project experience from the portfolio.",
          href: firstLiveProject.liveUrl,
          external: true,
          accent: "cyan",
        }
      : null,
    {
      title: "Download Resume",
      description: profile.data?.resumeUrl ? "Open the latest CMS-managed resume in a new tab." : "Resume not uploaded yet. Visit the resume page for status.",
      href: profile.data?.resumeUrl || "/resume",
      external: Boolean(profile.data?.resumeUrl),
      accent: "green",
    },
    { title: "Contact Me", description: "Start a conversation about backend work, systems, or product delivery.", href: "/contact", accent: "yellow" },
  ].filter(Boolean);
  const stats = [
    { label: "Projects Built", value: (projects.data || []).length, helper: "Production-ready portfolio systems", accent: "purple", progress: 72 },
    { label: "Backend Stack", value: `${new Set((skills.data || []).map((skill) => skill.category).filter(Boolean)).size || 1}+`, helper: "Core platform categories in rotation", accent: "cyan", progress: 64 },
    { label: "Production Impact", value: `${(achievements.data || []).length}+`, helper: "Outcome snapshots and measurable wins", accent: "green", progress: 58 },
    { label: "Current Focus", value: profile.data?.currentRole || "Backend systems", helper: "Primary engineering direction right now", accent: "yellow", progress: 81 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        subtitle="Backend Engineer Command Center"
        description="A premium command-center view of backend engineering work, project execution, delivery impact, and the systems thinking behind the portfolio."
        actions={
          <div className="flex flex-wrap gap-3">
            <Link to="/projects" className="rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-background">
              Explore projects
            </Link>
            <Link to="/contact" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-text-primary">
              Contact
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardCard
          title={profile.data?.headline || "Building backend systems with control-room clarity."}
          eyebrow="Journey Overview"
          description={profile.data?.heroDescription || "A read-only engineering workspace focused on APIs, reliability, shipping discipline, and the kind of product execution that stays clean under pressure."}
          className="grid-overlay"
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="cyan">Backend Engineer</StatusBadge>
              <StatusBadge tone="green">Open to impactful builds</StatusBadge>
              <StatusBadge tone="primary">Command-center design</StatusBadge>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_240px]">
              <div>
                <p className="text-sm leading-8 text-text-secondary">{profile.data?.aboutDescription || profile.data?.bio || "Add your engineering story, principles, and product perspective from the admin CMS."}</p>
              </div>
              <div className="rounded-[20px] border border-border bg-panel p-4">
                <p className="text-label">Developer status</p>
                <h3 className="mt-3 font-display text-xl text-text-primary">{profile.data?.fullName || "Portfolio Owner"}</h3>
                <p className="mt-2 text-sm leading-7 text-text-secondary">{profile.data?.subheadline || "Backend-focused engineer with a systems-first product mindset."}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(profile.data?.specialties || []).slice(0, 4).map((item) => (
                    <StatusBadge key={item} tone="primary">{item}</StatusBadge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>

        <div className="grid gap-4 md:grid-cols-2">
          {stats.map((stat) => (
            <MetricCard key={stat.label} label={stat.label} value={stat.value} helper={stat.helper} accent={stat.accent} progress={stat.progress} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr_1fr]">
        <DashboardCard title="Portfolio Completion" eyebrow="Progress Ring" description="A quick read on how complete the portfolio setup is right now.">
          <ProgressRing
            value={statsPayload.completion?.percentage || 0}
            sublabel={`${statsPayload.completion?.completed || 0} of ${statsPayload.completion?.total || 0} portfolio checkpoints complete`}
          />
        </DashboardCard>
        <DashboardCard title="Skill Topic Progress" eyebrow="Capability Map" description="Backend-leaning topic coverage across the public stack.">
          <TopicProgressList items={statsPayload.topicProgress || []} />
        </DashboardCard>
        <DashboardCard title="Project Status" eyebrow="Status Split" description="Live, in-progress, archived, and featured distribution.">
          <StatusSplitCard items={statsPayload.projectStatus || {}} />
        </DashboardCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardCard title="Featured Projects" eyebrow="Spotlight" description="Selected builds that show architecture decisions, execution depth, and practical backend thinking.">
          {(featuredProjects.data || []).length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {featuredProjects.data.slice(0, 4).map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState title="No featured projects yet. Add featured projects from CMS." />
          )}
        </DashboardCard>

        <div className="grid gap-4">
          <DashboardCard title="Skills" eyebrow="Capability Surface" description="Backend stack, tooling, and operating comfort zones.">
            <div className="grid gap-4">
              {(skills.data || []).slice(0, 4).map((skill) => (
                <SkillCard key={skill._id} skill={skill} />
              ))}
            </div>
          </DashboardCard>
          <DashboardCard title="Achievements" eyebrow="Impact Snapshot" description="A compact view of outcomes and delivery wins.">
            <div className="space-y-4">
              {(achievements.data || []).slice(0, 2).map((achievement) => (
                <AchievementCard key={achievement._id} achievement={achievement} />
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard title="Backend Journey" eyebrow="Experience" description="Recent roles and systems work arranged as a dense operational timeline.">
          <ExperienceTimeline items={(experience.data || []).slice(0, 3)} />
        </DashboardCard>
        <DashboardCard title="Resume Status" eyebrow="Document" description="Keep the public resume ready and accessible without cluttering the overview.">
          <div className="space-y-4">
            <div className="card-surface p-5">
              <p className="text-sm font-medium text-text-primary">{statsPayload.profileStatus?.hasResume ? "Resume ready" : "Resume not uploaded yet"}</p>
              <p className="mt-2 text-sm leading-7 text-text-secondary">
                {statsPayload.profileStatus?.hasResume
                  ? "The current resume is connected to the CMS and available from the public portfolio."
                  : "Upload a resume from the CMS to activate the public resume button and resume page."}
              </p>
            </div>
            <a
              href={profile.data?.resumeUrl || "/resume"}
              target={profile.data?.resumeUrl ? "_blank" : undefined}
              rel={profile.data?.resumeUrl ? "noopener noreferrer" : undefined}
              className="inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-text-primary"
            >
              {profile.data?.resumeUrl ? "Open current resume" : "Go to resume page"}
            </a>
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr]">
        <DashboardCard title="Quick Actions" eyebrow="Fast Paths" description="Jump directly into the most useful public portfolio actions.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.title} {...action} />
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default HomePage;
