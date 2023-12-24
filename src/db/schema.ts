import {
  serial,
  text,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";

export const heroPrimaryAttributeEnum = pgEnum("hero_primary_attribute", [
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
  primaryAttribute: heroPrimaryAttributeEnum("primary_attribute").notNull(),
});

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
  (table) => {
    return {
      pk: primaryKey({ columns: [table.heroId, table.type] }),
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

export const heroAbilityUpgradeTypeEnum = pgEnum("hero_ability_upgrade_type", [
  "Aghanim Shard",
  "Aghanim Scepter",
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
  (table) => {
    return {
      pk: primaryKey({ columns: [table.abilityId, table.type] }),
    };
  }
);

export const heroTalentLevelEnum = pgEnum("hero_talent_level", [
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
    level: heroTalentLevelEnum("level").notNull(),
    type: text("type").notNull(),
    effect: text("effect").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.heroId, table.level, table.type] }),
    };
  }
);

export const heroMetaInfoTypeEnum = pgEnum("hero_meta_info_type", [
  "Pick_Percentage",
  "Win_Percentage",
]);

export const heroMetaInfoRankEnum = pgEnum("hero_meta_info_rank", [
  "Herald_Guardian_Crusader",
  "Archon",
  "Legend",
  "Ancient",
  "Divine_Immortal",
]);

export const heroMetaInfo = pgTable(
  "hero_meta_info",
  {
    id: serial("id").unique(),
    heroId: integer("hero_id")
      .references(() => hero.id)
      .notNull(),
    type: heroMetaInfoTypeEnum("type").notNull(),
    rank: heroMetaInfoRankEnum("rank").notNull(),
    percentage: numeric("percentage", {
      precision: 4,
      scale: 2,
    }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.heroId, table.type, table.rank] }),
    };
  }
);

export const itemTypeEnum = pgEnum("item_type", [
  "Basic",
  "Upgrade",
  "Neutral",
]);

export const itemClassificationEnum = pgEnum("item_classification", [
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
  type: itemTypeEnum("type").notNull(),
  classification: itemClassificationEnum("classification").notNull(),
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

export const itemPriceTypeEnum = pgEnum("item_price_type", [
  "Purchase",
  "Sell",
]);

export const price = pgTable(
  "item_price",
  {
    id: serial("id").unique(),
    itemId: integer("item_id")
      .references(() => item.id)
      .notNull(),
    type: itemPriceTypeEnum("type").notNull(),
    amount: text("amount").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.itemId, table.type] }),
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

export const itemMetaInfo = pgTable("item_meta_info", {
  id: serial("id").unique(),
  itemId: integer("item_id")
    .references(() => item.id)
    .primaryKey(),
  uses: integer("uses").notNull(),
});

export const itemMetaInfoPercentageTypeEnum = pgEnum("item_meta_info_type", [
  "Use_Percentage",
  "Win_Percentage",
]);

export const itemMetaInfoPercentage = pgTable(
  "item_meta_info_percentage",
  {
    id: serial("id").unique(),
    itemMetaInfoId: integer("item_meta_info_id")
      .references(() => itemMetaInfo.id)
      .notNull(),
    type: itemMetaInfoPercentageTypeEnum("type").notNull(),
    percentage: numeric("percentage", {
      precision: 4,
      scale: 2,
    }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.itemMetaInfoId, table.type] }),
    };
  }
);
