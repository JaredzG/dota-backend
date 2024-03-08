import {
  serial,
  text,
  integer,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { type z } from "zod";
import { itemAbility } from "./itemAbility";

export const itemAbilityFeature = pgTable(
  "item_ability_feature",
  {
    id: serial("id").unique(),
    itemAbilityId: integer("item_ability_id")
      .references(() => itemAbility.id)
      .notNull(),
    type: text("type").notNull(),
    value: text("value"),
  },
  (itemAbilityFeature) => {
    return {
      pk: primaryKey({
        columns: [itemAbilityFeature.itemAbilityId, itemAbilityFeature.type],
      }),
    };
  }
);

export const insertItemAbilityFeatureSchema =
  createInsertSchema(itemAbilityFeature);

export type ItemAbilityFeature = z.infer<typeof insertItemAbilityFeatureSchema>;
