import ApiError from "../utils/ApiError.js";
import { sendError } from "../utils/apiResponse.js";

const normalizeValidationErrors = (errors, fallbackField = "form") =>
  (errors || []).map((entry) => {
    if (typeof entry === "string") {
      return { field: fallbackField, message: entry };
    }

    return {
      field: entry.field || fallbackField,
      message: entry.message || "Invalid value",
    };
  });

export const notFoundMiddleware = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorMiddleware = (error, _req, res, _next) => {
  if (error.isJoi) {
    return sendError(
      res,
      400,
      "Validation failed",
      normalizeValidationErrors(
        error.details.map((detail) => ({
          field: detail.path?.join(".") || "form",
          message: detail.message.replace(/["]/g, ""),
        }))
      )
    );
  }

  if (error.name === "ValidationError") {
    return sendError(
      res,
      400,
      "Validation failed",
      normalizeValidationErrors(
        Object.values(error.errors).map((value) => ({
          field: value.path || "form",
          message: value.message,
        }))
      )
    );
  }

  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    return sendError(res, 401, "Authentication failed", [{ field: "auth", message: error.message }]);
  }

  const statusCode = error.statusCode || 500;
  return sendError(
    res,
    statusCode,
    error.message || "Internal server error",
    normalizeValidationErrors(error.errors, statusCode >= 500 ? "server" : "form")
  );
};
