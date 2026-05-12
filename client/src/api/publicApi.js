import { apiRequest } from "./http";

export const publicApi = {
  getProfile: () => apiRequest("/public/profile"),
  getProjects: () => apiRequest("/public/projects"),
  getFeaturedProjects: () => apiRequest("/public/projects/featured"),
  getProjectBySlug: (slug) => apiRequest(`/public/projects/${slug}`),
  getExperience: () => apiRequest("/public/experience"),
  getAchievements: () => apiRequest("/public/achievements"),
  getSkills: () => apiRequest("/public/skills"),
  getEducation: () => apiRequest("/public/education"),
  getDashboardStats: () => apiRequest("/public/dashboard-stats"),
  getActivity: (limit = 12) => apiRequest(`/public/activity?limit=${limit}`),
  submitContact: (payload) =>
    apiRequest("/public/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
