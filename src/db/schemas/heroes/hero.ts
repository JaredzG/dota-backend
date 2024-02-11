import { serial, text, pgEnum, pgTable } from "drizzle-orm/pg-core";

export const heroComplexityEnum = pgEnum("hero_complexity", [
  "Simple",
  "Moderate",
  "Complex",
]);

export const heroAttackTypeEnum = pgEnum("hero_attack_type", [
  "Melee",
  "Ranged",
]);

export const heroPrimaryAttributeEnum = pgEnum("hero_primary_attribute", [
  "Strength",
  "Agility",
  "Intelligence",
  "Universal",
]);

export const hero = pgTable("hero", {
  id: serial("id").unique(),
  name: text("name").primaryKey(),
  alias: text("alias").unique(),
  biography: text("biography").notNull(),
  identity: text("identity").notNull(),
  description: text("description").notNull(),
  complexity: heroComplexityEnum("complexity").notNull(),
  attackType: heroAttackTypeEnum("attack_type").notNull(),
  primaryAttribute: heroPrimaryAttributeEnum("primary_attribute").notNull(),
  primaryImageKey: text("primary_image_key").unique(),
  secondaryImageKey: text("secondary_image_key").unique(),
});
