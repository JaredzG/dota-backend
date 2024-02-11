import {
  serial,
  text,
  integer,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";
import { item } from "./item";

export const itemAbility = pgTable(
  "item_ability",
  {
    id: serial("id").unique(),
    itemId: integer("item_id")
      .references(() => item.id)
      .notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    abilityType: text("ability_type").notNull(),
    affectedTarget: text("affected_target"),
    damageType: text("damage_type"),
  },
  (itemAbility) => {
    return {
      pk: primaryKey({ columns: [itemAbility.itemId, itemAbility.name] }),
    };
  }
);
