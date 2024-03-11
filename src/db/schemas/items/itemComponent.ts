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

export const itemComponentLevelEnum = pgEnum("item_component_level", [
  "Buildup",
  "Base",
]);

export const itemComponent = pgTable(
  "item_component",
  {
    id: serial("id").unique(),
    itemId: integer("item_id")
      .references(() => item.id)
      .notNull(),
    name: text("name").notNull(),
    amount: text("amount").notNull(),
    price: text("price").notNull(),
    level: itemComponentLevelEnum("level").notNull(),
  },
  (itemComponent) => {
    return {
      pk: primaryKey({ columns: [itemComponent.itemId, itemComponent.name] }),
    };
  }
);

export const insertItemComponentSchema = createInsertSchema(itemComponent);

export type ItemComponent = z.infer<typeof insertItemComponentSchema>;
