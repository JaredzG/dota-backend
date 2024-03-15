import {
  serial,
  text,
  integer,
  pgTable,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { type z } from "zod";
import { item } from "./item";

export const itemStatPropertyEnum = pgEnum("item_stat_property", [
  "Agility",
  "All Attributes",
  "AoE Radius",
  "Armor",
  "Attack Damage",
  "Attack Range",
  "Attack Speed",
  "Base Attack Speed",
  "Cast Range",
  "Debuff Duration Amp",
  "Evasion",
  "Gold per Minute",
  "Heal Amp",
  "Health",
  "Health Regen Amp",
  "Health Regeneration",
  "Intelligence",
  "Lifesteal",
  "Lifesteal Amp",
  "Magic Resistance",
  "Main Attribute",
  "Mana",
  "Mana Loss Reduction",
  "Mana Regen Amp",
  "Mana Regeneration",
  "Max HP Health Regen",
  "Move Speed",
  "Night Vision",
  "Other Attributes",
  "Projectile Speed",
  "Slow Resistance",
  "Spell Damage Amp",
  "Spell Lifesteal",
  "Spell Lifesteal Amp",
  "Status Resistance",
  "Strength",
  "Vision",
]);

export const itemStatEffectEnum = pgEnum("item_stat_effect", [
  "Increase",
  "Decrease",
]);

export const itemStatVariantEnum = pgEnum("item_stat_variant", [
  "Default",
  "Melee",
  "Ranged",
]);

export const itemStat = pgTable(
  "item_stat",
  {
    id: serial("id").unique(),
    itemId: integer("item_id")
      .references(() => item.id)
      .notNull(),
    property: itemStatPropertyEnum("property").notNull(),
    effect: itemStatEffectEnum("effect").notNull(),
    value: text("value").notNull(),
    variant: itemStatVariantEnum("variant").notNull(),
  },
  (itemStat) => {
    return {
      pk: primaryKey({ columns: [itemStat.itemId, itemStat.property] }),
    };
  }
);

export const insertItemStatSchema = createInsertSchema(itemStat);

export type ItemStat = z.infer<typeof insertItemStatSchema>;
