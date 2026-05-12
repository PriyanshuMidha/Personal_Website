import Admin from "../models/Admin.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/jwt.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token is required");
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);
  const admin = await Admin.findById(payload.id).select("-password");

  if (!admin) {
    throw new ApiError(401, "Authenticated admin no longer exists");
  }

  req.admin = admin;
  next();
});

