import Achievement from "../models/Achievement.js";
import { createCrudService } from "./baseCrudService.js";
import { createActivityLog } from "./activityService.js";

const crud = createCrudService(Achievement, {
  searchFields: ["title", "category", "description"],
  onCreate: (item) =>
    createActivityLog({
      actionType: "create",
      module: "achievement",
      title: item.title,
      description: `Added achievement "${item.title}".`,
    }),
  onUpdate: (item) =>
    createActivityLog({
      actionType: "update",
      module: "achievement",
      title: item.title,
      description: `Updated achievement "${item.title}".`,
    }),
  onRemove: (item) =>
    createActivityLog({
      actionType: "delete",
      module: "achievement",
      title: item.title,
      description: `Deleted achievement "${item.title}".`,
    }),
});

export const achievementService = {
  ...crud,
  async getFeatured() {
    return crud.listPublic({ isFeatured: true });
  },
  async listPreview(limit = 2) {
    return Achievement.find({ isPublished: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(limit)
      .select("title category description impact date isFeatured displayOrder");
  },
};
