import * as fs from "fs";
import path from "path";
import { connectDB, createPool } from "../db";
import {
  heroAbility,
  heroAbilityUpgrade,
  heroMetaInfo,
  heroTalent,
  item,
  itemAbility,
  itemComponent,
  itemMetaInfo,
  itemMetaInfoPercentage,
  itemPrice,
  itemStat,
} from "../schema";
import upsertHero from "../../utils/db/upsert_hero";

interface HeroAbilityUpgrade {
  id?: number;
  abilityId: number;
  type: "Shard Upgrade" | "Scepter Upgrade";
  description: string;
}

interface HeroTalent {
  id?: number;
  heroId: number;
  level: "Novice" | "Intermediate" | "Advanced" | "Expert";
  type: string;
  effect: string;
}

interface HeroMetaInfo {
  id?: number;
  heroId: number;
  type: "Pick Percentage" | "Win Percentage";
  rank:
    | "Herald / Guardian / Crusader"
    | "Archon"
    | "Legend"
    | "Ancient"
    | "Divine / Immortal";
  percentage: string;
}

interface Item {
  id?: number;
  name: string;
  lore: string | null;
  type: "Basic" | "Upgrade" | "Neutral";
  classification:
    | "Consumables"
    | "Attributes"
    | "Equipment"
    | "Miscellaneous"
    | "Secret"
    | "Accessories"
    | "Support"
    | "Magical"
    | "Armor"
    | "Weapons"
    | "Artifacts"
    | "Tier 1"
    | "Tier 2"
    | "Tier 3"
    | "Tier 4"
    | "Tier 5";
  hasStats: boolean;
  hasAbilities: boolean;
  hasPrices: boolean;
  hasComponents: boolean;
  imageUrl: string | null;
}

interface ItemStat {
  id?: number;
  itemId: number;
  effect: string;
}

interface ItemAbility {
  id?: number;
  itemId: number;
  name: string;
  description: string;
  abilityType: string;
  affectedTarget: string | null;
  damageType: string | null;
}

interface ItemPrice {
  id?: number;
  itemId: number;
  type: "Purchase Price" | "Sell Price";
  amount: string;
}

interface ItemComponent {
  id?: number;
  itemId: number;
  name: string;
  amount: string;
  price: string;
}

interface ItemMetaInfo {
  id?: number;
  itemId: number;
  uses: string;
}

interface ItemMetaInfoPercentage {
  id?: number;
  itemMetaInfoId: number;
  type: "Use Percentage" | "Win Percentage";
  percentage: string;
}

const heroesFilePath = "data/heroes.json";
const itemsFilePath = "data/items.json";
const heroesMetaFilePath = "data/heroes.meta.json";
const itemsMetaFilePath = "data/items.meta.json";

const heroItems = JSON.parse(fs.readFileSync(heroesFilePath, "utf-8"));
const itemItems = JSON.parse(fs.readFileSync(itemsFilePath, "utf-8"));
const heroMetaInfoItems = JSON.parse(
  fs.readFileSync(heroesMetaFilePath, "utf-8")
);
const itemMetaInfoItems = JSON.parse(
  fs.readFileSync(itemsMetaFilePath, "utf-8")
);

const pool = await createPool();
const db = await connectDB(pool);

for (const heroItem of heroItems) {
  await upsertHero(db, heroItem, heroMetaInfoItems);

  for (const talent of talents) {
    const { level, type, effect } = talent;
    const heroTalentEntry: HeroTalent = {
      heroId: insertedHeroId,
      level,
      type,
      effect,
    };
    await db
      .insert(heroTalent)
      .values(heroTalentEntry)
      .onConflictDoUpdate({
        target: [heroTalent.heroId, heroTalent.level, heroTalent.type],
        set: heroTalentEntry,
      });
  }
  for (const metaPercentage of percentages) {
    const { rank, type, percentage } = metaPercentage;
    const heroMetaInfoEntry: HeroMetaInfo = {
      heroId: insertedHeroId,
      rank,
      type,
      percentage,
    };
    await db
      .insert(heroMetaInfo)
      .values(heroMetaInfoEntry)
      .onConflictDoUpdate({
        target: [heroMetaInfo.heroId, heroMetaInfo.rank, heroMetaInfo.type],
        set: heroMetaInfoEntry,
      });
  }
}

for (const itemItem of itemItems) {
  const {
    name,
    lore,
    type,
    classification,
    stats,
    abilities,
    prices,
    components,
  } = itemItem;
  const { uses, percentages } = itemMetaInfoItems.filter(
    (itemMetaInfoItem: {
      name: string;
      uses: string;
      percentages: Array<{ type: string; percentage: string }>;
    }) => itemMetaInfoItem.name === name
  )[0];
  let hasStats = false;
  let hasAbilities = false;
  let hasPrices = false;
  let hasComponents = false;
  if (stats !== null) {
    hasStats = true;
  }
  if (abilities !== null) {
    hasAbilities = true;
  }
  if (prices !== null) {
    hasPrices = true;
  }
  if (components !== null) {
    hasComponents = true;
  }
  const itemEntry: Item = {
    name,
    lore,
    type,
    classification,
    hasStats,
    hasAbilities,
    hasPrices,
    hasComponents,
    imageUrl: null,
  };
  const insertedItem: Item[] = await db
    .insert(item)
    .values(itemEntry)
    .onConflictDoUpdate({
      target: item.name,
      set: itemEntry,
    })
    .returning();
  const insertedItemId: number = insertedItem[0].id ?? 0;
  if (stats !== null) {
    for (const stat of stats) {
      const itemStatEntry: ItemStat = {
        itemId: insertedItemId,
        effect: stat,
      };
      await db
        .insert(itemStat)
        .values(itemStatEntry)
        .onConflictDoUpdate({
          target: [itemStat.itemId, itemStat.effect],
          set: itemStatEntry,
        });
    }
  }
  if (abilities !== null) {
    for (const ability of abilities) {
      const {
        name,
        description,
        features: {
          ability_type: abilityType,
          affected_target: affectedTarget,
          damage_type: damageType,
        },
      } = ability;
      const itemAbilityEntry: ItemAbility = {
        itemId: insertedItemId,
        name,
        description,
        abilityType,
        affectedTarget,
        damageType,
      };
      await db
        .insert(itemAbility)
        .values(itemAbilityEntry)
        .onConflictDoUpdate({
          target: [itemAbility.itemId, itemAbility.name],
          set: itemAbilityEntry,
        });
    }
  }
  if (prices !== null) {
    for (const price of prices) {
      const { type, amount } = price;
      const itemPriceEntry: ItemPrice = {
        itemId: insertedItemId,
        type,
        amount,
      };
      await db
        .insert(itemPrice)
        .values(itemPriceEntry)
        .onConflictDoUpdate({
          target: [itemPrice.itemId, itemPrice.type],
          set: itemPriceEntry,
        });
    }
  }
  if (components !== null) {
    for (const component of components) {
      const { name, amount, price } = component;
      const itemComponentEntry: ItemComponent = {
        itemId: insertedItemId,
        name,
        amount,
        price,
      };
      await db
        .insert(itemComponent)
        .values(itemComponentEntry)
        .onConflictDoUpdate({
          target: [itemComponent.itemId, itemComponent.name],
          set: itemComponentEntry,
        });
    }
  }
  const itemMetaInfoEntry: ItemMetaInfo = {
    itemId: insertedItemId,
    uses,
  };
  const returnedItemMetaInfo: ItemMetaInfo[] = await db
    .insert(itemMetaInfo)
    .values(itemMetaInfoEntry)
    .onConflictDoUpdate({
      target: itemMetaInfo.itemId,
      set: itemMetaInfoEntry,
    })
    .returning();
  const returnedItemMetaInfoId: number = returnedItemMetaInfo[0].id ?? 0;
  for (const metaPercentage of percentages) {
    const { type, percentage } = metaPercentage;
    const itemMetaInfoPercentageEntry: ItemMetaInfoPercentage = {
      itemMetaInfoId: returnedItemMetaInfoId,
      type,
      percentage,
    };
    await db
      .insert(itemMetaInfoPercentage)
      .values(itemMetaInfoPercentageEntry)
      .onConflictDoUpdate({
        target: [
          itemMetaInfoPercentage.itemMetaInfoId,
          itemMetaInfoPercentage.type,
        ],
        set: itemMetaInfoPercentageEntry,
      });
  }
}
await pool.end();
