import {
  serial,
  text,
  integer,
  pgTable,
  primaryKey,
  boolean,
} from "drizzle-orm/pg-core";
import { hero } from "./hero";

export const heroAbility = pgTable(
  "hero_ability",
  {
    id: serial("id").unique(),
    heroId: integer("hero_id")
      .references(() => hero.id)
      .notNull(),
    name: text("name").notNull(),
    lore: text("lore"),
    description: text("description").notNull(),
    abilityType: text("ability_type").notNull(),
    affectedTarget: text("affected_target"),
    damageType: text("damage_type"),
    hasShardUpgrade: boolean("has_shard_upgrade").notNull(),
    hasScepterUpgrade: boolean("has_scepter_upgrade").notNull(),
    imageKey: text("image_key").unique(),
  },
  (heroAbility) => {
    return {
      pk: primaryKey({ columns: [heroAbility.heroId, heroAbility.name] }),
    };
  }
);
