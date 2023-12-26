import { sql } from "drizzle-orm";
import { createPool, connectDB } from "../db";

const pool = createPool();
const db = connectDB(pool);

// Delete all rows in all tables and restart the associated table sequences.
await db.execute(sql`TRUNCATE hero, item RESTART IDENTITY CASCADE`);

await pool.end();
