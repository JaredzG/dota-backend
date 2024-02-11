import * as fs from "fs";
import { db } from "../db";
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

for (const heroItem of heroItems) {
  await upsertHero(db, heroItem, heroMetaInfoItems);
}

for (const itemItem of itemItems) {
  await upsertItem(db, itemItem, itemMetaInfoItems);
}
