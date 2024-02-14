import {
  serial,
  text,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { type z } from "zod";
import { heroAbility } from "./heroAbility";

export const heroAbilityUpgradeTypeEnum = pgEnum("hero_ability_upgrade_type", [
  "Shard Upgrade",
  "Scepter Upgrade",
]);

export const heroAbilityUpgrade = pgTable(
  "hero_ability_upgrade",
  {
    id: serial("id").unique(),
    abilityId: integer("ability_id")
      .references(() => heroAbility.id)
      .notNull(),
    type: heroAbilityUpgradeTypeEnum("type").notNull(),
    description: text("description").notNull(),
  },
  (heroAbilityUpgrade) => {
    return {
      pk: primaryKey({
        columns: [heroAbilityUpgrade.abilityId, heroAbilityUpgrade.type],
      }),
    };
  }
);

export const insertHeroAbilityUpgradeSchema =
  createInsertSchema(heroAbilityUpgrade);

export type HeroAbilityUpgrade = z.infer<typeof insertHeroAbilityUpgradeSchema>;
