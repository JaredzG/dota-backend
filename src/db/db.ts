import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as fs from "fs"
import * as schema from "./schemas/hero.schema"

export const pool = new Pool({
  host: process.env.DOTA_DB_HOST,
  port: 5432,
  user: process.env.DOTA_DB_USER,
  password: fs.readFileSync("/run/secrets/postgres-password", "utf8"),
  database: process.env.DOTA_DB_NAME,
})

export const db = drizzle(pool, { schema })
