import {
  serial,
  text,
  integer,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";
import { item } from "./item";

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
  },
  (itemComponent) => {
    return {
      pk: primaryKey({ columns: [itemComponent.itemId, itemComponent.name] }),
    };
  }
);
