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
    property: text("property").notNull(),
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
