// src/config/database.ts
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const {
  DATABASE_URL,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DATABASE_SSL,
  NODE_ENV,
} = process.env;

const connectionString =
  DATABASE_URL ||
  (DB_USER && DB_PASSWORD && DB_HOST && DB_PORT && DB_NAME
    ? `postgresql://${encodeURIComponent(DB_USER)}:${encodeURIComponent(
        DB_PASSWORD
      )}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
    : undefined);

if (!connectionString) {
  console.warn("⚠️ No DB connection string found. Check env vars.");
}

const useSSL =
  DATABASE_SSL === "true" ||
  (NODE_ENV === "production" &&
    DATABASE_SSL !== "false" &&
    !/localhost|127\.0\.0\.1/.test(connectionString || ""));

const pool = new Pool({
  connectionString,
  ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`Query OK (${duration}ms)`, text.slice(0, 60));
    return result;
  } catch (err: any) {
    console.error("❌ DB Query Error:", err.message ?? err);
    throw err;
  }
};

async function waitForDB(retries = 6) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      await pool.query("SELECT 1");
      console.log("✅ Database connected");
      return;
    } catch (err: any) {
      attempt++;
      console.log(`⏳ DB retry ${attempt}/${retries}: ${err.message ?? err}`);
      await new Promise((res) => setTimeout(res, 1000 * attempt));
    }
  }
  throw new Error("❌ DB connection failed after retries");
}

/**
 * Initialize tables and extensions (safe: IF NOT EXISTS).
 * Run this before any seeding or queries that require tables.
 */
export const initializeTables = async () => {
  // Make sure DB is reachable first
  await waitForDB();

  console.log("📦 Creating extensions and tables (if missing)...");

  // You used gen_random_uuid() earlier — create pgcrypto extension
  await query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  // Create users
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);

  // topics
  await query(`
    CREATE TABLE IF NOT EXISTS topics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      icon VARCHAR(50),
      difficulty VARCHAR(20) DEFAULT 'medium',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await query(`CREATE INDEX IF NOT EXISTS idx_topics_slug ON topics(slug);`);

  // questions
  await query(`
    CREATE TABLE IF NOT EXISTS questions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
      question TEXT NOT NULL,
      options JSONB NOT NULL,
      correct_answer INTEGER NOT NULL,
      difficulty VARCHAR(20) DEFAULT 'medium',
      explanation TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
    CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
  `);

  // quiz_attempts
  await query(`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      percentage DECIMAL(5,2) NOT NULL,
      time_taken INTEGER,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_attempts_user ON quiz_attempts(user_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_topic ON quiz_attempts(topic_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_score ON quiz_attempts(score DESC);
  `);

  // user_answers
  await query(`
    CREATE TABLE IF NOT EXISTS user_answers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
      question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
      selected_answer INTEGER NOT NULL,
      is_correct BOOLEAN NOT NULL,
      time_taken INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_answers_attempt ON user_answers(attempt_id);
    CREATE INDEX IF NOT EXISTS idx_answers_question ON user_answers(question_id);
  `);

  console.log("✅ Tables initialized");
};

export const initializeDatabase = async () => {
  // kept for backward compatibility: waits for DB and optionally does other steps
  await waitForDB();
};

pool.on("error", (err:any) => {
  console.error("❌ PG Pool Error:", err);
});

export default pool;
