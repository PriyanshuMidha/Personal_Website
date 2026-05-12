import ActivityLog from "../models/ActivityLog.js";

const DAY_RANGE = 126;
const PROFILE_UPDATE_DEDUP_WINDOW_MS = 10 * 60 * 1000;

export const skillTopicOrderList = ["Backend", "Frontend", "Database", "Messaging", "DevOps", "Languages", "Tools", "Soft Skills"];

export const normalizeSkillCategory = (value = "") => {
  const normalized = String(value).trim().toLowerCase();

  if (["backend", "api", "server", "node", "express"].includes(normalized)) return "Backend";
  if (["database", "db", "mongodb", "postgresql", "mysql", "redis"].includes(normalized)) return "Database";
  if (["messaging", "queue", "queues", "kafka", "rabbitmq", "pubsub", "pub/sub"].includes(normalized)) return "Messaging";
  if (["devops", "infra", "infrastructure", "cloud", "aws", "docker", "kubernetes", "ci/cd", "ci"].includes(normalized)) return "DevOps";
  if (["frontend", "ui", "react", "web"].includes(normalized)) return "Frontend";
  if (["language", "languages", "javascript", "typescript", "python", "java", "go", "c++"].includes(normalized)) return "Languages";
  if (["tools", "tooling", "testing", "observability"].includes(normalized)) return "Tools";
  if (["soft skill", "soft skills", "communication", "leadership", "collaboration"].includes(normalized)) return "Soft Skills";

  return value || "Tools";
};

export const createActivityLog = async ({ actionType, module, title, description }) => {
  if (actionType === "update" && module === "profile") {
    const cutoff = new Date(Date.now() - PROFILE_UPDATE_DEDUP_WINDOW_MS);
    const existing = await ActivityLog.findOne({
      actionType,
      module,
      updatedAt: { $gte: cutoff },
    }).sort({ updatedAt: -1, createdAt: -1 });

    if (existing) {
      existing.title = title;
      existing.description = description;
      await existing.save();
      return existing;
    }
  }

  return ActivityLog.create({
    actionType,
    module,
    title,
    description,
  });
};

export const listActivity = async ({ limit = 30, module } = {}) => {
  const filter = module ? { module } : {};
  return ActivityLog.find(filter).sort({ updatedAt: -1, createdAt: -1 }).limit(limit);
};

export const buildHeatmapData = async () => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - DAY_RANGE);
  start.setHours(0, 0, 0, 0);

  const activity = await ActivityLog.aggregate([
    { $match: { $or: [{ createdAt: { $gte: start } }, { updatedAt: { $gte: start } }] } },
    {
      $addFields: {
        activityDate: { $ifNull: ["$updatedAt", "$createdAt"] },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$activityDate" },
          month: { $month: "$activityDate" },
          day: { $dayOfMonth: "$activityDate" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
  ]);

  const map = new Map(
    activity.map((entry) => {
      const date = new Date(Date.UTC(entry._id.year, entry._id.month - 1, entry._id.day));
      return [date.toISOString().slice(0, 10), entry.count];
    })
  );

  const cells = [];
  const cursor = new Date(start);
  while (cursor <= today) {
    const dateKey = cursor.toISOString().slice(0, 10);
    const count = map.get(dateKey) || 0;
    cells.push({
      date: dateKey,
      count,
      intensity: count === 0 ? 0 : count >= 4 ? 4 : count >= 3 ? 3 : count >= 2 ? 2 : 1,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return cells;
};
