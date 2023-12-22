import {
  serial,
  text,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";

export const heroPrimaryAttributeEnum = pgEnum("primary_attribute", [
  "Strength",
  "Agility",
  "Intelligence",
  "Universal",
]);

export const hero = pgTable("hero", {
  id: serial("id").unique(),
  name: text("name").primaryKey(),
  biography: text("biography").notNull(),
  identity: text("identity").notNull(),
  description: text("description").notNull(),
  primary_attribute: heroPrimaryAttributeEnum("primary_attribute").notNull(),
  herald_guardian_crusader_pick_percentage: numeric(
    "herald_guardian_crusader_pick_percentage",
    { precision: 4, scale: 2 }
  ).notNull(),
  herald_guardian_crusader_win_percentage: numeric(
    "herald_guardian_crusader_win_percentage",
    { precision: 4, scale: 2 }
  ).notNull(),
  archon_pick_percentage: numeric("archon_pick_percentage", {
    precision: 4,
    scale: 2,
  }).notNull(),
  archon_win_percentage: numeric("archon_win_percentage", {
    precision: 4,
    scale: 2,
  }).notNull(),
  legend_pick_percentage: numeric("legend_pick_percentage", {
    precision: 4,
    scale: 2,
  }).notNull(),
  legend_win_percentage: numeric("legend_win_percentage", {
    precision: 4,
    scale: 2,
  }).notNull(),
  ancient_pick_percentage: numeric("ancient_pick_percentage", {
    precision: 4,
    scale: 2,
  }).notNull(),
  ancient_win_percentage: numeric("ancient_win_percentage", {
    precision: 4,
    scale: 2,
  }).notNull(),
  divine_immortal_pick_percentage: numeric("divine_immortal_pick_percentage", {
    precision: 4,
    scale: 2,
  }).notNull(),
  divine_immortal_win_percentage: numeric("divine_immortal_win_percentage", {
    precision: 4,
    scale: 2,
  }).notNull(),
});

export const heroRoleTypeEnum = pgEnum("role_type", [
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
    roleType: heroRoleTypeEnum("role_type").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.heroId, table.roleType] }),
    };
  }
);

export const heroAbility = pgTable(
  "hero_ability",
  {
    id: serial("id").unique(),
    heroId: integer("hero_id")
      .references(() => hero.id)
      .notNull(),
    name: text("name").notNull(),
    lore: text("lore").notNull(),
    description: text("description").notNull(),
    abilityType: text("ability_type").notNull(),
    damageType: text("damage_type").notNull(),
    affectedTarget: text("affected_target").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.heroId, table.name] }),
    };
  }
);

export const abilityUpgradeTypeEnum = pgEnum("upgrade_type", [
  "Aghanim Shard",
  "Aghanim Scepter",
]);

export const upgrade = pgTable(
  "hero_ability_upgrade",
  {
    id: serial("id").unique(),
    abilityId: integer("ability_id")
      .references(() => heroAbility.id)
      .notNull(),
    upgradeType: abilityUpgradeTypeEnum("upgrade_type").notNull(),
    description: text("description").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.abilityId, table.upgradeType] }),
    };
  }
);

export const heroTalentLevelEnum = pgEnum("talent_level", [
  "Novice",
  "Intermediate",
  "Advanced",
  "Expert",
]);

export const heroTalent = pgTable(
  "hero_talent",
  {
    id: serial("id").unique(),
    heroId: integer("hero_id")
      .references(() => hero.id)
      .notNull(),
    talentLevel: heroTalentLevelEnum("talent_level").notNull(),
    leftRoute: text("left_route").notNull(),
    rightRoute: text("right_route").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.heroId, table.talentLevel] }),
    };
  }
);

export const itemTypeEnum = pgEnum("item_type", [
  "Basic",
  "Upgrade",
  "Neutral",
]);

export const itemClassificationEnum = pgEnum("classification", [
  "Consumables",
  "Attributes",
  "Equipment",
  "Miscellaneous",
  "Secret",
  "Accessories",
  "Support",
  "Magical",
  "Armor",
  "Weapons",
  "Artifacts",
  "Tier 1",
  "Tier 2",
  "Tier 3",
  "Tier 4",
  "Tier 5",
]);

export const item = pgTable("item", {
  id: serial("id").unique(),
  name: text("name").primaryKey(),
  lore: text("lore").notNull(),
  itemType: itemTypeEnum("item_type").notNull(),
  classification: itemClassificationEnum("classification").notNull(),
  times_bought: integer("times_bought").notNull(),
  use_percentage: numeric("use_percentage", {
    precision: 4,
    scale: 2,
  }).notNull(),
  win_percentage: numeric("win_percentage", {
    precision: 4,
    scale: 2,
  }).notNull(),
});

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
    damageType: text("damage_type").notNull(),
    affectedTarget: text("affected_target").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.itemId, table.name] }),
    };
  }
);

export const itemStat = pgTable(
  "item_stat",
  {
    id: serial("id").unique(),
    itemId: integer("item_id")
      .references(() => item.id)
      .notNull(),
    description: text("description").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.itemId, table.description] }),
    };
  }
);

export const itemPriceTypeEnum = pgEnum("price_type", ["Purchase", "Sell"]);

export const price = pgTable(
  "item_price",
  {
    id: serial("id").unique(),
    itemId: integer("item_id")
      .references(() => item.id)
      .notNull(),
    priceType: itemPriceTypeEnum("price_type").notNull(),
    amount: text("amount").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.itemId, table.priceType] }),
    };
  }
);

export const itemComponent = pgTable(
  "item_component",
  {
    id: serial("id").unique(),
    itemId: integer("item_id")
      .references(() => item.id)
      .notNull(),
    name: text("name").notNull(),
    amount: text("amount").notNull(),
    price: text("price").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.itemId, table.name] }),
    };
  }
);
