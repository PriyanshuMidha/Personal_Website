import mongoose from "mongoose";
import { setDatabaseState } from "./dbState.js";

const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    setDatabaseState({
      status: "missing_configuration",
      message: "MONGO_URI is missing. Add it to server/.env before starting the server.",
      originalError: null,
    });
    throw new Error("MONGO_URI is missing. Add it to server/.env before starting the server.");
  }

  mongoose.set("strictQuery", true);
  setDatabaseState({
    status: "connecting",
    message: "Connecting to MongoDB Atlas...",
    originalError: null,
  });

  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    setDatabaseState({
      status: "connected",
      message: `Connected to ${connection.connection.host}/${connection.connection.name}`,
      originalError: null,
    });
    console.log(`[MongoDB] Connected to ${connection.connection.host}/${connection.connection.name}`);
  } catch (error) {
    const originalMessage = error?.message || "Unknown MongoDB connection error";
    setDatabaseState({
      status: "error",
      message: "MongoDB connection failed. Check Atlas IP access, credentials, cluster health, and network/TLS settings.",
      originalError: originalMessage,
    });
    console.error("[MongoDB] Connection failed.");
    console.error(`[MongoDB] Original error: ${originalMessage}`);
    throw new Error(
      `MongoDB connection failed. Check Atlas IP access, credentials, cluster health, and network/TLS settings. Original error: ${originalMessage}`
    );
  }
};

export default connectDatabase;
