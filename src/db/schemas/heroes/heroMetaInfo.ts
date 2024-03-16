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
import { hero } from "./hero";

export const heroMetaInfoRankEnum = pgEnum("hero_meta_info_rank", [
  "Herald | Guardian | Crusader",
  "Archon",
  "Legend",
  "Ancient",
  "Divine | Immortal",
]);

export const heroMetaInfoPercentageTypeEnum = pgEnum(
  "hero_meta_info_percentage_type",
  ["Pick Rate", "Win Rate"]
);

export const heroMetaInfo = pgTable(
  "hero_meta_info",
  {
    id: serial("id").unique(),
    heroId: integer("hero_id")
      .references(() => hero.id)
      .notNull(),
    rank: heroMetaInfoRankEnum("rank").notNull(),
    type: heroMetaInfoPercentageTypeEnum("type").notNull(),
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
