import {
  serial,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  numeric,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { type z } from "zod";
import { item } from "./item";

export const itemPriceTypeEnum = pgEnum("item_price_type", [
  "Purchase Price",
  "Sell Price",
]);

export const itemPriceUnitEnum = pgEnum("item_price_unit", [
  "Gold",
  "Gold per Count",
]);

export const itemPrice = pgTable(
  "item_price",
  {
    id: serial("id").unique(),
    itemId: integer("item_id")
      .references(() => item.id)
      .notNull(),
    type: itemPriceTypeEnum("type").notNull(),
    amount: numeric("amount", {
      precision: 5,
      scale: 1,
    }),
    unit: itemPriceUnitEnum("unit"),
  },
  (itemPrice) => {
    return {
      pk: primaryKey({ columns: [itemPrice.itemId, itemPrice.type] }),
    };
  }
);

export const insertItemPriceSchema = createInsertSchema(itemPrice);

export type ItemPrice = z.infer<typeof insertItemPriceSchema>;
