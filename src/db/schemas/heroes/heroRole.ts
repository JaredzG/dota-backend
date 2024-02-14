import {
  serial,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { type z } from "zod";
import { hero } from "./hero";

export const heroRoleTypeEnum = pgEnum("hero_role_type", [
  "Carry",
  "Support",
  "Nuker",
  "Disabler",
  "Durable",
  "Escape",
  "Pusher",
  "Initiator",
]);

export const heroRole = pgTable(
  "hero_role",
  {
    id: serial("id").unique(),
    heroId: integer("hero_id")
      .references(() => hero.id)
      .notNull(),
    type: heroRoleTypeEnum("type").notNull(),
  },
  (heroRole) => {
    return {
      pk: primaryKey({ columns: [heroRole.heroId, heroRole.type] }),
    };
  }
);

export const insertHeroRoleSchema = createInsertSchema(heroRole);

export type HeroRole = z.infer<typeof insertHeroRoleSchema>;
