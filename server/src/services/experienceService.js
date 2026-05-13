import Experience from "../models/Experience.js";
import { createCrudService } from "./baseCrudService.js";
import { createActivityLog } from "./activityService.js";

export const experienceService = createCrudService(Experience, {
  searchFields: ["company", "role", "location"],
  defaultSort: { displayOrder: 1, startDate: -1 },
  onCreate: (item) =>
    createActivityLog({
      actionType: "create",
      module: "experience",
      title: item.role,
      description: `Added experience entry for ${item.role} at ${item.company}.`,
    }),
  onUpdate: (item) =>
    createActivityLog({
      actionType: "update",
      module: "experience",
      title: item.role,
      description: `Updated experience entry for ${item.role} at ${item.company}.`,
    }),
  onRemove: (item) =>
    createActivityLog({
      actionType: "delete",
      module: "experience",
      title: item.role,
      description: `Deleted experience entry for ${item.role} at ${item.company}.`,
    }),
});

experienceService.listPreview = async (limit = 3) =>
  Experience.find({ isPublished: true })
    .sort({ displayOrder: 1, startDate: -1 })
    .limit(limit)
    .select("company role startDate endDate isCurrent location description techStack displayOrder")
    .lean();
