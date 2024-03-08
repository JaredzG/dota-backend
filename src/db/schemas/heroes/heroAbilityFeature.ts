import {
  serial,
  text,
  integer,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { type z } from "zod";
import { heroAbility } from "./heroAbility";

export const heroAbilityFeature = pgTable(
  "hero_ability_feature",
  {
    id: serial("id").unique(),
    heroAbilityId: integer("hero_ability_id")
      .references(() => heroAbility.id)
      .notNull(),
    type: text("type").notNull(),
    value: text("value"),
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
