import slugify from "slugify";
import Project from "../models/Project.js";
import ApiError from "../utils/ApiError.js";
import { createCrudService } from "./baseCrudService.js";
import { createActivityLog } from "./activityService.js";

const crud = createCrudService(Project, {
  searchFields: ["title", "category", "status", "shortDescription"],
  onCreate: (item) =>
    createActivityLog({
      actionType: "create",
      module: "project",
      title: item.title,
      description: `Created project entry "${item.title}".`,
    }),
  onUpdate: (item) =>
    createActivityLog({
      actionType: "update",
      module: "project",
      title: item.title,
      description: `Updated project entry "${item.title}".`,
    }),
  onRemove: (item) =>
    createActivityLog({
      actionType: "delete",
      module: "project",
      title: item.title,
      description: `Deleted project entry "${item.title}".`,
    }),
});

const ensureUniqueSlug = async (slug, currentId = null) => {
  const existingProject = await Project.findOne({ slug });
  if (existingProject && String(existingProject._id) !== String(currentId)) {
    throw new ApiError(409, "Project slug already exists");
  }
};

export const projectService = {
  ...crud,

  async create(payload) {
    const slug = slugify(payload.slug || payload.title, { lower: true, strict: true });
    await ensureUniqueSlug(slug);
    return crud.create({ ...payload, slug });
  },

  async update(id, payload) {
    const slug = slugify(payload.slug || payload.title, { lower: true, strict: true });
    await ensureUniqueSlug(slug, id);
    return crud.update(id, { ...payload, slug });
  },

  async getPublicBySlug(slug) {
    const project = await Project.findOne({ slug, isPublished: true });
    if (!project) {
      throw new ApiError(404, "Project not found");
    }
    return project;
  },

  async getFeaturedProjects() {
    return crud.listPublic({ isFeatured: true });
  },
};
