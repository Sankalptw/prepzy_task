import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./config/database";
import { seedDatabase } from "./utils/seedData";
import authRoutes from "./routes/authRoutes";
import topicRoutes from "./routes/topicRoutes";
import quizRoutes from "./routes/quizRoutes";
import leaderboardRoutes from "./routes/leaderboardRoutes";

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

// ✅ Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:3000",
  "https://prepzy-task-frontend-1.onrender.com"
];

// ✅ CORS configuration (fixed)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true); // allow server-side or curl
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);
      return callback(new Error("CORS Not Allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle OPTIONS request
app.options("*", cors());

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// ✅ Root
app.get("/", (req, res) => {
  res.json({
    message: "Smart Quiz Arena backend running 🚀",
  });
});

// ✅ Health
app.get("/health", (req, res) =>
  res.json({ status: "UP", time: new Date().toISOString() })
);

// ✅ 404
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route Not Found" })
);

// ✅ Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ success: false, error: "Server Error" });
});

// ✅ Boot server
const startServer = async () => {
  try {
    console.log("⏳ Connecting DB...");
    await initializeDatabase();
    console.log("✅ DB Connected");

    await seedDatabase();
    console.log("✅ DB Seeded");

    app.listen(PORT, () => {
      console.log(`🚀 Server LIVE on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup Error:", err);
    process.exit(1);
  }
};

startServer();
