import {
  serial,
  text,
  integer,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { item } from "./item";

export const itemStat = pgTable(
  "item_stat",
  {
    id: serial("id").unique(),
    itemId: integer("item_id")
      .references(() => item.id)
      .notNull(),
    effect: text("effect").notNull(),
  },
  (itemStat) => {
    return {
      pk: primaryKey({ columns: [itemStat.itemId, itemStat.effect] }),
    };
  }
);

export const insertItemStatSchema = createInsertSchema(itemStat);
