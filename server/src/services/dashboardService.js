import Project from "../models/Project.js";
import Experience from "../models/Experience.js";
import Achievement from "../models/Achievement.js";
import Skill from "../models/Skill.js";
import Education from "../models/Education.js";
import ContactMessage from "../models/ContactMessage.js";
import { getProfile } from "./profileService.js";
import { buildHeatmapData, listActivity, normalizeSkillCategory, skillTopicOrderList } from "./activityService.js";

const buildProjectStatusStats = async (publishedOnly = false) => {
  const filter = publishedOnly ? { isPublished: true } : {};
  const [live, inProgress, archived, featured] = await Promise.all([
    Project.countDocuments({ ...filter, status: { $regex: /^live$/i } }),
    Project.countDocuments({ ...filter, status: { $regex: /in[- ]?progress/i } }),
    Project.countDocuments({ ...filter, status: { $regex: /^archived$/i } }),
    Project.countDocuments({ ...filter, isFeatured: true }),
  ]);

  return { live, inProgress, archived, featured };
};

const buildSkillTopicProgress = async (publishedOnly = false) => {
  const filter = publishedOnly ? { isPublished: true } : {};
  const skills = await Skill.find(filter).select("category");
  const total = skills.length;
  const bucketMap = new Map(skillTopicOrderList.map((topic) => [topic, 0]));

  skills.forEach((skill) => {
    const normalized = normalizeSkillCategory(skill.category);
    bucketMap.set(normalized, (bucketMap.get(normalized) || 0) + 1);
  });

  return skillTopicOrderList.map((topic) => {
    const count = bucketMap.get(topic) || 0;
    return {
      topic,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0,
    };
  });
};

const buildPortfolioCompletion = async () => {
  const [profile, projects, skills, experience, achievements] = await Promise.all([
    getProfile(),
    Project.countDocuments(),
    Skill.countDocuments(),
    Experience.countDocuments(),
    Achievement.countDocuments(),
  ]);

  const checks = [
    { label: "Profile completed", complete: Boolean(profile?.fullName && profile?.headline && profile?.email) },
    { label: "Projects added", complete: projects > 0 },
    { label: "Skills added", complete: skills > 0 },
    { label: "Experience added", complete: experience > 0 },
    { label: "Achievements added", complete: achievements > 0 },
    { label: "Resume uploaded", complete: Boolean(profile?.resume?.url || profile?.resumeUrl) },
  ];

  const completed = checks.filter((item) => item.complete).length;

  return {
    completed,
    total: checks.length,
    percentage: Math.round((completed / checks.length) * 100),
    checks,
  };
};

const buildImpactStats = async (publishedOnly = false) => {
  const filter = publishedOnly ? { isPublished: true } : {};
  const [projectsBuilt, skillsAdded, achievementsAdded, experienceEntries] = await Promise.all([
    Project.countDocuments(filter),
    Skill.countDocuments(filter),
    Achievement.countDocuments(filter),
    Experience.countDocuments(filter),
  ]);

  return {
    projectsBuilt,
    skillsAdded,
    achievementsAdded,
    experienceEntries,
  };
};

export const getDashboardStats = async ({ publishedOnly = false } = {}) => {
  const [completion, topicProgress, projectStatus, impactStats, heatmap, recentActivity] = await Promise.all([
    buildPortfolioCompletion(),
    buildSkillTopicProgress(publishedOnly),
    buildProjectStatusStats(publishedOnly),
    buildImpactStats(publishedOnly),
    buildHeatmapData(),
    listActivity({ limit: publishedOnly ? 10 : 20 }),
  ]);

  const profile = await getProfile({ publishedOnly });

  return {
    completion,
    topicProgress,
    projectStatus,
    impactStats,
    heatmap,
    recentActivity,
    profileStatus: {
      hasProfile: Boolean(profile),
      hasResume: Boolean(profile?.resume?.url || profile?.resumeUrl),
      publishedOnly,
    },
    timestamp: new Date().toISOString(),
  };
};

export const getDashboardSummary = async () => {
  const [
    projects,
    featuredProjects,
    experiences,
    achievements,
    skills,
    education,
    messages,
    unreadMessages,
    recentMessages,
    recentProjects,
    widgets,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ isFeatured: true }),
    Experience.countDocuments(),
    Achievement.countDocuments(),
    Skill.countDocuments(),
    Education.countDocuments(),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ status: "new" }),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5).select("name email subject status createdAt"),
    Project.find().sort({ updatedAt: -1 }).limit(5).select("title slug status isFeatured isPublished updatedAt category"),
    getDashboardStats(),
  ]);

  return {
    stats: {
      totalProjects: projects,
      featuredProjects,
      totalExperience: experiences,
      totalAchievements: achievements,
      totalSkills: skills,
      totalEducation: education,
      totalMessages: messages,
      unreadMessages,
      experiences,
      achievements,
      skills,
      education,
      messages,
      projects,
    },
    widgets,
    recentMessages,
    recentProjects,
    quickActions: [
      {
        id: "create-project",
        label: "Create Project",
        description: "Add a new featured build to the portfolio workspace.",
        href: "/admin/projects",
        accent: "primary",
      },
      {
        id: "review-messages",
        label: "Review Messages",
        description: "Triaging fresh contact requests and inbound conversations.",
        href: "/admin/messages",
        accent: "green",
      },
      {
        id: "update-resume",
        label: "Update Resume",
        description: "Replace the public resume file and keep it current.",
        href: "/admin/resume",
        accent: "cyan",
      },
    ],
    system: {
      authMode: "JWT",
      contentModules: 6,
      uploadProviders: ["Cloudinary", "Local Upload Fallback", "Resume Upload"],
    },
  };
};
