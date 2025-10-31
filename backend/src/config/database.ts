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
  } catch (err:any) {
    console.error("❌ DB Query Error:", err.message);
    throw err;
  }
};

// retry-handle db connection on render start
async function waitForDB(retries = 6) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      await pool.query("SELECT 1");
      console.log("✅ Database connected");
      return;
    } catch (err:any) {
      attempt++;
      console.log(`⏳ DB retry ${attempt}/${retries}: ${err.message}`);
      await new Promise((res) => setTimeout(res, 1000 * attempt));
    }
  }
  throw new Error("❌ DB connection failed after retries");
}

export const initializeDatabase = async () => {
  await waitForDB();
};

pool.on("error", (err:any) => {
  console.error("❌ PG Pool Error:", err);
});

export default pool;
