import {
  serial,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { type z } from "zod";
import { itemMetaInfo } from "./itemMetaInfo";

export const itemMetaInfoPercentageTypeEnum = pgEnum(
  "item_meta_info_percentage_type",
  ["Usage Rate", "Win Rate"]
);

export const itemMetaInfoPercentage = pgTable(
  "item_meta_info_percentage",
  {
    id: serial("id").unique(),
    itemMetaInfoId: integer("item_meta_info_id")
      .references(() => itemMetaInfo.id)
      .notNull(),
    type: itemMetaInfoPercentageTypeEnum("type").notNull(),
    percentage: numeric("percentage", {
      precision: 4,
      scale: 2,
    }),
  },
  (itemMetaInfoPercentage) => {
    return {
      pk: primaryKey({
        columns: [
          itemMetaInfoPercentage.itemMetaInfoId,
          itemMetaInfoPercentage.type,
        ],
      }),
    };
  }
);

export const insertItemMetaInfoPercentageSchema = createInsertSchema(
  itemMetaInfoPercentage
);

export type ItemMetaInfoPercentage = z.infer<
  typeof insertItemMetaInfoPercentageSchema
>;
