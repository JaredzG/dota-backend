import * as fs from "fs";
import { connectDB, createPool } from "../db";
import { s3, s3BucketName } from "../../s3/s3";
import upsertHero from "../../utils/db/heroes/upsert_hero";
import upsertItem from "../../utils/db/items/upsert_item";

const heroesFilePath = "data/heroes.json";
const itemsFilePath = "data/items.json";
const heroesMetaFilePath = "data/heroes.meta.json";
const itemsMetaFilePath = "data/items.meta.json";

const heroItems = JSON.parse(fs.readFileSync(heroesFilePath, "utf-8"));
const itemItems = JSON.parse(fs.readFileSync(itemsFilePath, "utf-8"));
const heroMetaInfoItems = JSON.parse(
  fs.readFileSync(heroesMetaFilePath, "utf-8")
);
const itemMetaInfoItems = JSON.parse(
  fs.readFileSync(itemsMetaFilePath, "utf-8")
);

const pool = await createPool();
const db = await connectDB(pool);

for (const heroItem of heroItems) {
  await upsertHero(db, s3, s3BucketName, heroItem, heroMetaInfoItems);
}

for (const itemItem of itemItems) {
  await upsertItem(db, s3, s3BucketName, itemItem, itemMetaInfoItems);
}
await pool.end();
