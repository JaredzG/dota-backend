import {
  serial,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { hero } from "./hero";
import { type z } from "zod";

export const heroMetaInfoTypeEnum = pgEnum("hero_meta_info_type", [
  "Pick Percentage",
  "Win Percentage",
]);

export const heroMetaInfoRankEnum = pgEnum("hero_meta_info_rank", [
  "Herald / Guardian / Crusader",
  "Archon",
  "Legend",
  "Ancient",
  "Divine / Immortal",
]);

export const heroMetaInfo = pgTable(
  "hero_meta_info",
  {
    id: serial("id").unique(),
    heroId: integer("hero_id")
      .references(() => hero.id)
      .notNull(),
    rank: heroMetaInfoRankEnum("rank").notNull(),
    type: heroMetaInfoTypeEnum("type").notNull(),
    percentage: numeric("percentage", {
      precision: 4,
      scale: 2,
    }).notNull(),
  },
  (heroMetaInfo) => {
    return {
      pk: primaryKey({
        columns: [heroMetaInfo.heroId, heroMetaInfo.rank, heroMetaInfo.type],
      }),
    };
  }
);

export const insertHeroMetaInfoSchema = createInsertSchema(heroMetaInfo);

export type HeroMetaInfo = z.infer<typeof insertHeroMetaInfoSchema>;
