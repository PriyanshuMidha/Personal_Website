import express from "express";
import path from "node:path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { apiLimiter, authLimiter, contactLimiter } from "./middlewares/rateLimiter.js";
import { databaseReadyMiddleware } from "./middlewares/databaseReady.js";
import { notFoundMiddleware, errorMiddleware } from "./middlewares/errorMiddleware.js";
import systemRoutes from "./routes/systemRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];
const configuredOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((value) => value.trim()).filter(Boolean)
  : [];
const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...configuredOrigins])];
const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser tools like curl/Postman and approved frontend origins.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(
  cors(corsOptions)
);
app.options("*", cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio CMS server is healthy",
    data: { uptime: process.uptime() },
  });
});

app.use("/api", apiLimiter);
app.use("/api", systemRoutes);
app.use("/api", databaseReadyMiddleware);
app.use("/api/public/contact", contactLimiter);
app.use("/api/admin/auth/login", authLimiter);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
