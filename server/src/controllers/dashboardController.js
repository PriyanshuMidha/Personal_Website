import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { getAdminDashboardOverview, getDashboardStats, getDashboardSummary } from "../services/dashboardService.js";

export const getDashboard = asyncHandler(async (_req, res) => {
  const summary = await getDashboardSummary();
  sendSuccess(res, 200, "Dashboard fetched", summary);
});

export const getAdminDashboardStats = asyncHandler(async (_req, res) => {
  const stats = await getDashboardStats();
  sendSuccess(res, 200, "Dashboard stats fetched", stats);
});

export const getAdminDashboardOverviewData = asyncHandler(async (_req, res) => {
  const overview = await getAdminDashboardOverview();
  sendSuccess(res, 200, "Dashboard overview fetched", overview);
});

export const getPublicDashboardStats = asyncHandler(async (_req, res) => {
  const stats = await getDashboardStats({ publishedOnly: true });
  sendSuccess(res, 200, "Public dashboard stats fetched", stats);
});
