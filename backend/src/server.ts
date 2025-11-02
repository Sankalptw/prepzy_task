import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { initializeDatabase } from "./config/database";
import { seedDatabase } from "./utils/seedData";
import authRoutes from "./routes/authRoutes";
import topicRoutes from "./routes/topicRoutes";
import quizRoutes from "./routes/quizRoutes";
import leaderboardRoutes from "./routes/leaderboardRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

const FRONTEND_URL = (process.env.FRONTEND_URL || "https://prepzy-task-frontend-1.onrender.com").trim();
const LOCAL_URL = "http://localhost:3000";

app.use((req: Request, res: Response, next: NextFunction) => {
  const originHeader = (req.headers.origin || "").toString();

  if (!originHeader || originHeader === FRONTEND_URL || originHeader === LOCAL_URL) {
    if (originHeader) {
      res.setHeader("Access-Control-Allow-Origin", originHeader);
    } else {
      res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
    }

    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept"
    );

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    return next();
  }

  console.warn("❌ CORS Blocked:", originHeader);
  return res.status(403).json({ success: false, message: "CORS blocked" });
});

app.options("*", (req, res) => {
  res.sendStatus(200);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📨 ${req.method} ${req.url} | Origin: ${req.headers.origin || "none"}`);
  next();
});


app.get("/health", (req: Request, res: Response) =>
  res.json({ status: "UP", time: new Date().toISOString() })
);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Smart Quiz Arena backend running ✅",
    frontend: FRONTEND_URL,
    version: "1.0.0",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/leaderboard", leaderboardRoutes);


app.use((req: Request, res: Response) =>
  res.status(404).json({ success: false, message: "Route not found", path: req.path })
);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Global error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});


const startServer = async () => {
  try {
    console.log("🔄 Connecting to DB...");
    await initializeDatabase();
    console.log("✅ DB Connected");

    if (process.env.SKIP_SEED !== "true") {
      console.log("🌱 Seeding DB...");
      await seedDatabase();
      console.log("✅ Seeding Complete");
    } else {
      console.log("⏭ Skipping seed (SKIP_SEED=true)");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 FRONTEND allowed: ${FRONTEND_URL}`);
    });
  } catch (err) {
    console.error("❌ Startup Failure:", err);
    process.exit(1);
  }
};

startServer();
