import {
  serial,
  integer,
  pgTable,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { type z } from "zod";
import { itemAbility } from "./itemAbility";

export const itemAbilityFeatureTypeEnum = pgEnum("item_ability_feature_type", [
  "Ability Type",
  "Affected Target",
  "Damage Type",
]);

export const itemAbilityFeatureValueEnum = pgEnum(
  "item_ability_feature_value",
  [
    "Allied Heroes",
    "Allies",
    "Aura",
    "Channeled",
    "Enemies",
    "Enemy Heroes",
    "Enemy Units",
    "Heroes",
    "Hidden",
    "Instant Attack",
    "Instant Kill",
    "Magical",
    "No Target",
    "Passive",
    "Physical",
    "Self",
    "Source Type",
    "Target Area",
    "Target Point",
    "Target Unit",
    "Toggle",
    "Trees",
    "Units",
  ]
);

export const itemAbilityFeature = pgTable(
  "item_ability_feature",
  {
    id: serial("id").unique(),
    itemAbilityId: integer("item_ability_id")
      .references(() => itemAbility.id)
      .notNull(),
    type: itemAbilityFeatureTypeEnum("type").notNull(),
    value: itemAbilityFeatureValueEnum("value"),
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
