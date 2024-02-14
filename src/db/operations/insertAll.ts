import * as fs from "fs";
import { db } from "../db";
import insertHero from "../../lib/db/heroes/insertHero";
import insertItem from "../../lib/db/items/insertItem";

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
  await insertHero(db, heroItem, heroMetaInfoItems);
}

for (const itemItem of itemItems) {
  await insertItem(db, itemItem, itemMetaInfoItems);
}
