import mongoose from "mongoose";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const readyStateLabels = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

const getConnectionSnapshot = () => {
  const { connection } = mongoose;

  return {
    readyState: connection.readyState,
    status: readyStateLabels[connection.readyState] || "unknown",
    host: connection.host || null,
    dbName: connection.name || null,
  };
};

export const getHealth = (_req, res) => {
  const mongodb = getConnectionSnapshot();

  return sendSuccess(res, 200, "Portfolio CMS API is healthy", {
    server: "running",
    mongodb,
    timestamp: new Date().toISOString(),
  });
};

export const pingDatabase = async (_req, res) => {
  const mongodb = getConnectionSnapshot();

  if (mongodb.readyState !== 1 || !mongoose.connection.db) {
    return sendError(res, 503, "MongoDB is not connected", {
      ...mongodb,
      timestamp: new Date().toISOString(),
    });
  }

  const pingResult = await mongoose.connection.db.admin().ping();

  return sendSuccess(res, 200, "MongoDB ping successful", {
    server: "running",
    mongodb,
    ping: pingResult,
    timestamp: new Date().toISOString(),
  });
};
