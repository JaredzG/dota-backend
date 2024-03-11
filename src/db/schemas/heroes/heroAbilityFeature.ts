import {
  serial,
  integer,
  pgTable,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { type z } from "zod";
import { heroAbility } from "./heroAbility";

export const heroAbilityFeatureTypeEnum = pgEnum("hero_ability_feature_type", [
  "Ability Type",
  "Affected Target",
  "Damage Type",
]);

export const heroAbilityFeatureValueEnum = pgEnum(
  "hero_ability_feature_value",
  [
    "Active Attack Modifier",
    "Allied Heroes",
    "Allies",
    "Astral Spirit",
    "Aura",
    "Autocast",
    "Boar",
    "Channeled",
    "Enemies",
    "Enemy Heroes",
    "Enemy Units",
    "Familiars",
    "HP Removal",
    "Heroes",
    "Instant Attack",
    "Instant Kill",
    "Magical",
    "No Target",
    "Passive",
    "Physical",
    "Proximity Mine",
    "Pure",
    "Self",
    "Source Type",
    "Target Area",
    "Target Point",
    "Target Unit",
    "The Self",
    "Toggle",
    "Trees",
    "Units",
    "Vector Targeting",
    "Wolves",
  ]
);

export const heroAbilityFeature = pgTable(
  "hero_ability_feature",
  {
    id: serial("id").unique(),
    heroAbilityId: integer("hero_ability_id")
      .references(() => heroAbility.id)
      .notNull(),
    type: heroAbilityFeatureTypeEnum("type").notNull(),
    value: heroAbilityFeatureValueEnum("value"),
  },
  (heroAbilityFeature) => {
    return {
      pk: primaryKey({
        columns: [heroAbilityFeature.heroAbilityId, heroAbilityFeature.type],
      }),
    };
  }
);

export const insertHeroAbilityFeatureSchema =
  createInsertSchema(heroAbilityFeature);

export type HeroAbilityFeature = z.infer<typeof insertHeroAbilityFeatureSchema>;
