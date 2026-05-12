import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { listActivity } from "../services/activityService.js";

export const getAdminActivity = asyncHandler(async (req, res) => {
  const activity = await listActivity({ limit: Number(req.query.limit) || 30, module: req.query.module });
  sendSuccess(res, 200, "Activity fetched", activity);
});

export const getPublicActivity = asyncHandler(async (req, res) => {
  const activity = await listActivity({ limit: Math.min(Number(req.query.limit) || 12, 20) });
  sendSuccess(
    res,
    200,
    "Public activity fetched",
    activity.map((item) => ({
      _id: item._id,
      actionType: item.actionType,
      module: item.module,
      title: item.title,
      description: item.description,
      createdAt: item.createdAt,
    }))
  );
});
