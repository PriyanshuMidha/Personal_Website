import { getDatabaseState, isDatabaseReady } from "../config/dbState.js";
import { sendError } from "../utils/apiResponse.js";

export const databaseReadyMiddleware = (req, res, next) => {
  if (req.path === "/health" || req.path === "/api/health" || req.path === "/api/test/db") {
    return next();
  }

  if (isDatabaseReady()) {
    return next();
  }

  const state = getDatabaseState();
  return sendError(
    res,
    503,
    "API is temporarily unavailable while the database connection is offline.",
    {
      databaseStatus: state.status,
      details: state.message,
      originalError: process.env.NODE_ENV === "production" ? null : state.originalError,
    }
  );
};
