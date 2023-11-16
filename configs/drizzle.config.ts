import type { Config } from "drizzle-kit"
import * as fs from "fs"

export default {
  schema: "./src/db/schemas/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: process.env.DOTA_DB_HOST as string,
    port: 5432,
    user: process.env.DOTA_DB_USER,
    password: fs.readFileSync("/run/secrets/postgres-password", "utf8"),
    database: process.env.DOTA_DB_NAME as string,
  },
} satisfies Config
