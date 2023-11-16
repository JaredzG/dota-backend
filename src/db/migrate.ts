import { migrate } from "drizzle-orm/node-postgres/migrator"
import { db, pool } from "./db"

await migrate(db, { migrationsFolder: "./drizzle" })
await pool.end()
