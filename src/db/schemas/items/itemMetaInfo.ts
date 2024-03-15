import { serial, integer, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { type z } from "zod";
import { item } from "./item";

export const itemMetaInfo = pgTable("item_meta_info", {
  id: serial("id").unique(),
  itemId: integer("item_id")
    .references(() => item.id)
    .primaryKey(),
  uses: integer("uses").notNull(),
});

export const insertItemMetaInfoSchema = createInsertSchema(itemMetaInfo);

export type ItemMetaInfo = z.infer<typeof insertItemMetaInfoSchema>;
