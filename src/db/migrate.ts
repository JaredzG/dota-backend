import { migrate } from "drizzle-orm/node-postgres/migrator";
import { connectDB, createPool } from "./db";

const pool = await createPool();
const db = await connectDB(pool);

await migrate(db, { migrationsFolder: "./drizzle" });
await pool.end();
