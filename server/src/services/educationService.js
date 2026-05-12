import Education from "../models/Education.js";
import { createCrudService } from "./baseCrudService.js";
import { createActivityLog } from "./activityService.js";

export const educationService = createCrudService(Education, {
  searchFields: ["degree", "institution", "grade"],
  defaultSort: { displayOrder: 1, startYear: -1 },
  onCreate: (item) =>
    createActivityLog({
      actionType: "create",
      module: "education",
      title: item.degree,
      description: `Added education entry "${item.degree}" at ${item.institution}.`,
    }),
  onUpdate: (item) =>
    createActivityLog({
      actionType: "update",
      module: "education",
      title: item.degree,
      description: `Updated education entry "${item.degree}" at ${item.institution}.`,
    }),
  onRemove: (item) =>
    createActivityLog({
      actionType: "delete",
      module: "education",
      title: item.degree,
      description: `Deleted education entry "${item.degree}" at ${item.institution}.`,
    }),
});
