// src/server.ts
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { initializeDatabase } from "./config/database";
import { seedDatabase } from "./utils/seedData";
import authRoutes from "./routes/authRoutes";
import topicRoutes from "./routes/topicRoutes";
import quizRoutes from "./routes/quizRoutes";
import leaderboardRoutes from "./routes/leaderboardRoutes";

// Load env first
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

// FRONTEND origin(s)
const FRONTEND_URL = (process.env.FRONTEND_URL || "https://prepzy-task-frontend-1.onrender.com").trim();
const LOCAL_URL = "http://localhost:3000"; // dev fallback

// ---------- Robust CORS middleware (safe for Render) ----------
app.use((req: Request, res: Response, next: NextFunction) => {
  const originHeader = (req.headers.origin || "").toString();

  // Allow server-side calls (no origin) and allowed origins
  if (!originHeader || originHeader === FRONTEND_URL || originHeader === LOCAL_URL) {
    // If origin present, echo it; required when using credentials
    if (originHeader) {
      res.setHeader("Access-Control-Allow-Origin", originHeader);
    } else {
      // fallback - set explicit allowed origin (helps some clients)
      res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
    }

    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept"
    );

    // quick respond to preflight
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    return next();
  }

  // Disallowed origin: respond 403 (don't throw)
  console.warn("❌ CORS blocked origin:", originHeader);
  return res.status(403).json({ success: false, message: "CORS blocked" });
});
// -----------------------------------------------------------------

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📨 ${req.method} ${req.path} — Origin: ${req.headers.origin || "no-origin"}`);
  next();
});

// Health and root endpoints
app.get("/health", (req: Request, res: Response) =>
  res.status(200).json({ status: "UP", time: new Date().toISOString() })
);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Smart Quiz Arena API",
    version: "1.0.0",
    frontend: FRONTEND_URL,
    endpoints: {
      auth: "/api/auth",
      topics: "/api/topics",
      quiz: "/api/quiz",
      leaderboard: "/api/leaderboard",
      health: "/health",
    },
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// 404 handler
app.use((req: Request, res: Response) =>
  res.status(404).json({ success: false, message: "Route not found", path: req.path })
);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Global error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server (DB init + optional seeding)
const startServer = async () => {
  try {
    console.log("\n🔄 Initializing database...");
    await initializeDatabase();
    console.log("✅ Database initialized successfully\n");

    if (process.env.SKIP_SEED !== "true") {
      console.log("🌱 Seeding database with initial data...");
      await seedDatabase();
      console.log("✅ Database seeded successfully\n");
    } else {
      console.log("⏭ SKIP_SEED=true — skipping automatic seeding");
    }

    app.listen(PORT, () => {
      console.log("=================================");
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`📡 API root: /`);
      console.log(`🏥 Health: /health`);
      console.log("=================================");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// graceful shutdown handlers (optional)
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down gracefully...");
  process.exit(0);
});
process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down gracefully...");
  process.exit(0);
});
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
