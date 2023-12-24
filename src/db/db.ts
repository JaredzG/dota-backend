import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as fs from "fs";

const { Pool } = pg;

const passwordFile: string | undefined = process.env.DOTA_DB_PASSWORD_FILE;

export const createPool = (): pg.Pool => {
  return new Pool({
    host: process.env.DOTA_DB_HOST,
    port: 5432,
    user: process.env.DOTA_DB_USER,
    password: fs.readFileSync(`${passwordFile}`, "utf8"),
    database: process.env.DOTA_DB_NAME,
  });
};

export const connectDB = (pool: pg.Pool) => drizzle(pool);
