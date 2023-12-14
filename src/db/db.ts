import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as fs from "fs";

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DOTA_DB_HOST,
  port: 5432,
  user: process.env.DOTA_DB_USER,
  password: fs.readFileSync(`${process.env.DOTA_DB_PASSWORD_FILE}`, "utf8"),
  database: process.env.DOTA_DB_NAME,
});

export const db = drizzle(pool);

export const createPool = () => {
  return new Pool({
    host: process.env.DOTA_DB_HOST,
    port: 5432,
    user: process.env.DOTA_DB_USER,
    password: fs.readFileSync(`${process.env.DOTA_DB_PASSWORD_FILE}`, "utf8"),
    database: process.env.DOTA_DB_NAME,
  });
};

export const connectDB = (pool) => drizzle(pool);
