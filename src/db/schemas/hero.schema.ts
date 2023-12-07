import { serial, text, pgTable, pgEnum } from "drizzle-orm/pg-core";

export const primaryAttributeEnum = pgEnum("primary_attribute", [
  "Strength",
  "Agility",
  "Intelligence",
  "Universal",
]);
export const hero = pgTable("hero", {
  id: serial("id"),
  name: text("name"),
  bio: text("bio"),
  identity: text("identity"),
  description: text("description"),
  primary_attribute: primaryAttributeEnum("primary_attribute"),
});
