import Skill from "../models/Skill.js";
import { createCrudService } from "./baseCrudService.js";
import { createActivityLog } from "./activityService.js";

export const skillService = createCrudService(Skill, {
  searchFields: ["name", "category", "level"],
  onCreate: (item) =>
    createActivityLog({
      actionType: "create",
      module: "skill",
      title: item.name,
      description: `Added skill "${item.name}".`,
    }),
  onUpdate: (item) =>
    createActivityLog({
      actionType: "update",
      module: "skill",
      title: item.name,
      description: `Updated skill "${item.name}".`,
    }),
  onRemove: (item) =>
    createActivityLog({
      actionType: "delete",
      module: "skill",
      title: item.name,
      description: `Deleted skill "${item.name}".`,
    }),
});
