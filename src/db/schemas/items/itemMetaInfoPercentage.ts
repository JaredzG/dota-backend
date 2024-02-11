import {
  serial,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";
import { itemMetaInfo } from "./itemMetaInfo";

export const itemMetaInfoPercentageTypeEnum = pgEnum("item_meta_info_type", [
  "Use Percentage",
  "Win Percentage",
]);

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
