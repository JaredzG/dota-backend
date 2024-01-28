import {
  serial,
  text,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  boolean,
} from "drizzle-orm/pg-core";

export const heroComplexityEnum = pgEnum("hero_complexity", [
  "Simple",
  "Moderate",
  "Complex",
]);

export const heroAttackTypeEnum = pgEnum("hero_attack_type", [
  "Melee",
  "Ranged",
]);

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
  complexity: heroComplexityEnum("complexity").notNull(),
  attackType: heroAttackTypeEnum("attack_type").notNull(),
  primaryAttribute: heroPrimaryAttributeEnum("primary_attribute").notNull(),
  primaryImageUrl: text("primary_image_url"),
  secondaryImageUrl: text("secondary_image_url"),
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
    lore: text("lore"),
    description: text("description").notNull(),
    abilityType: text("ability_type").notNull(),
    affectedTarget: text("affected_target"),
    damageType: text("damage_type"),
    hasShardUpgrade: boolean("has_shard_upgrade").notNull(),
    hasScepterUpgrade: boolean("has_scepter_upgrade").notNull(),
    imageUrl: text("image_url"),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.heroId, table.name] }),
    };
  }
);

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
  (table) => {
    return {
      pk: primaryKey({ columns: [table.heroId, table.rank, table.type] }),
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
  lore: text("lore"),
  type: itemTypeEnum("type").notNull(),
  classification: itemClassificationEnum("classification").notNull(),
  hasStats: boolean("has_stats").notNull(),
  hasAbilities: boolean("has_abilities").notNull(),
  hasPrices: boolean("has_prices").notNull(),
  hasComponents: boolean("has_components").notNull(),
  imageUrl: text("image_url"),
});

export const itemStat = pgTable(
  "item_stat",
  {
    id: serial("id").unique(),
    itemId: integer("item_id")
      .references(() => item.id)
      .notNull(),
    effect: text("effect").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.itemId, table.effect] }),
    };
  }
);

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
  (table) => {
    return {
      pk: primaryKey({ columns: [table.itemId, table.name] }),
    };
  }
);

export const itemPriceTypeEnum = pgEnum("item_price_type", [
  "Purchase Price",
  "Sell Price",
]);

export const itemPrice = pgTable(
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
  uses: text("uses").notNull(),
});

export const itemMetaInfoPercentageTypeEnum = pgEnum("item_meta_info_type", [
  "Use Percentage",
  "Win Percentage",
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
