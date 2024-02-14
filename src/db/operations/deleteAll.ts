import { sql } from "drizzle-orm";
import { db } from "../db";

// Delete all rows in all tables and restart the associated table sequences.
await db.execute(sql`TRUNCATE hero, item RESTART IDENTITY CASCADE`);
