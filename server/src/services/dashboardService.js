import Project from "../models/Project.js";
import Experience from "../models/Experience.js";
import Achievement from "../models/Achievement.js";
import Skill from "../models/Skill.js";
import Education from "../models/Education.js";
import ContactMessage from "../models/ContactMessage.js";
import { getProfile, getSerializedProfile } from "./profileService.js";
import { projectService } from "./projectService.js";
import { skillService } from "./skillService.js";
import { experienceService } from "./experienceService.js";
import { achievementService } from "./achievementService.js";
import { buildHeatmapData, listActivity, normalizeSkillCategory, skillTopicOrderList } from "./activityService.js";

const buildProjectStatusStats = async (publishedOnly = false) => {
  const filter = publishedOnly ? { isPublished: true } : {};

  const [result] = await Project.aggregate([
    { $match: filter },
    {
      $facet: {
        live: [{ $match: { status: { $regex: /^live$/i } } }, { $count: "count" }],
        inProgress: [{ $match: { status: { $regex: /in[- ]?progress/i } } }, { $count: "count" }],
        archived: [{ $match: { status: { $regex: /^archived$/i } } }, { $count: "count" }],
        featured: [{ $match: { isFeatured: true } }, { $count: "count" }],
      },
    },
  ]);

  return {
    live: result.live[0]?.count || 0,
    inProgress: result.inProgress[0]?.count || 0,
    archived: result.archived[0]?.count || 0,
    featured: result.featured[0]?.count || 0,
  };
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

const countAcrossCollections = async (baseModel, entries, filter = {}) => {
  const [baseKey, ...restEntries] = entries;
  const results = await baseModel.aggregate([
    { $match: filter },
    { $count: "count" },
    { $addFields: { key: baseKey.key } },
    ...restEntries.map(({ coll, key }) => ({
      $unionWith: { coll, pipeline: [{ $match: filter }, { $count: "count" }, { $addFields: { key } }] },
    })),
  ]);

  const counts = Object.fromEntries(entries.map(({ key }) => [key, 0]));
  results.forEach((row) => {
    counts[row.key] = row.count;
  });
  return counts;
};

const buildPortfolioCompletion = async () => {
  const [profile, counts] = await Promise.all([
    getProfile(),
    countAcrossCollections(Project, [
      { key: "projects" },
      { coll: "skills", key: "skills" },
      { coll: "experiences", key: "experience" },
      { coll: "achievements", key: "achievements" },
    ]),
  ]);
  const { projects, skills, experience, achievements } = counts;

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
  const counts = await countAcrossCollections(
    Project,
    [
      { key: "projectsBuilt" },
      { coll: "skills", key: "skillsAdded" },
      { coll: "achievements", key: "achievementsAdded" },
      { coll: "experiences", key: "experienceEntries" },
    ],
    filter
  );

  return counts;
};

export const getDashboardStats = async ({ publishedOnly = false } = {}) => {
  const [completion, topicProgress, projectStatus, impactStats, heatmap, recentActivity, profile] = await Promise.all([
    buildPortfolioCompletion(),
    buildSkillTopicProgress(publishedOnly),
    buildProjectStatusStats(publishedOnly),
    buildImpactStats(publishedOnly),
    // Public visitors never see the activity heatmap/log (HomePage doesn't render them),
    // so skip these two DB round trips (an aggregation + a query) on that path.
    publishedOnly ? Promise.resolve([]) : buildHeatmapData(),
    publishedOnly ? Promise.resolve([]) : listActivity({ limit: 20 }),
    getProfile({ publishedOnly }),
  ]);

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

export const getPublicHomeData = async () => {
  const [profile, featuredProjects, skillsPreview, experiencePreview, achievementsPreview, publicStats] = await Promise.all([
    getSerializedProfile({ publishedOnly: true }),
    projectService.listFeaturedSummary(4),
    skillService.listPreview(4),
    experienceService.listPreview(3),
    achievementService.listPreview(2),
    getDashboardStats({ publishedOnly: true }),
  ]);

  return {
    profile,
    featuredProjects,
    skillsPreview,
    experiencePreview,
    achievementsPreview,
    publicStats,
  };
};

export const getAdminDashboardOverview = async () => {
  const [
    totalProjects,
    featuredProjects,
    totalSkills,
    unreadMessages,
    recentProjects,
    recentMessages,
    activity,
    portfolioCompletion,
    topicProgress,
    projectStatus,
    heatmap,
    impactStats,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ isFeatured: true }),
    Skill.countDocuments(),
    ContactMessage.countDocuments({ status: "new" }),
    Project.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title slug status isFeatured isPublished updatedAt category"),
    ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email subject status createdAt"),
    listActivity({ limit: 5 }),
    buildPortfolioCompletion(),
    buildSkillTopicProgress(false),
    buildProjectStatusStats(false),
    buildHeatmapData(),
    buildImpactStats(false),
  ]);

  return {
    totalProjects,
    featuredProjects,
    totalSkills,
    unreadMessages,
    recentProjects,
    recentMessages,
    activity,
    portfolioCompletion,
    topicProgress,
    projectStatus,
    heatmap,
    impactStats,
  };
};
