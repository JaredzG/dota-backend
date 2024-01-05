import type { Config } from "drizzle-kit";
import * as fs from "fs";

const DB_HOST = process.env.DB_HOST ?? "postgres";
const DB_PORT = parseInt(process.env.DB_PORT ?? "5432");
const DB_USER = process.env.DB_USER ?? "postgres";
const DB_PASSWORD_FILE =
  process.env.DB_PASSWORD_FILE ?? "/run/secrets/postgres-password";
const DB_PASSWORD = fs.readFileSync(DB_PASSWORD_FILE, "utf8");
const DB_NAME = process.env.DB_NAME ?? "dota-database";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  },
} satisfies Config;
