import { serial, text, integer, pgTable } from "drizzle-orm/pg-core";
import { item } from "./item";

export const itemMetaInfo = pgTable("item_meta_info", {
  id: serial("id").unique(),
  itemId: integer("item_id")
    .references(() => item.id)
    .primaryKey(),
  uses: text("uses").notNull(),
});
