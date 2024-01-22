import * as fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { connectDB, createPool } from "../db";
import {
  hero,
  heroAbility,
  heroAbilityUpgrade,
  heroMetaInfo,
  heroRole,
  heroTalent,
  item,
  itemAbility,
  itemComponent,
  itemMetaInfo,
  itemMetaInfoPercentage,
  itemPrice,
  itemStat,
} from "../schema";

interface Hero {
  id?: number;
  name: string;
  biography: string;
  identity: string;
  description: string;
  complexity: "Simple" | "Moderate" | "Complex";
  attackType: "Melee" | "Ranged";
  primaryAttribute: "Strength" | "Agility" | "Intelligence" | "Universal";
}

interface HeroRole {
  id?: number;
  heroId: number;
  type:
    | "Carry"
    | "Support"
    | "Nuker"
    | "Disabler"
    | "Durable"
    | "Escape"
    | "Pusher"
    | "Initiator";
}

interface HeroAbility {
  id?: number;
  heroId: number;
  name: string;
  lore: string | null;
  description: string;
  abilityType: string;
  damageType: string | null;
  affectedTarget: string | null;
  hasShardUpgrade: boolean;
  hasScepterUpgrade: boolean;
}

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

const heroImages = fs.readdirSync("images/heroes");
const heroSelectionImages = fs.readdirSync("images/heroes2");
const abilityImages = fs.readdirSync("images/abilities");
const itemImages = fs.readdirSync("images/items");

const pool = await createPool();
const db = await connectDB(pool);

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME ?? "lotus-app-images";
const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION ?? "us-east-2";
const S3_BUCKET_ACCESS_KEY =
  process.env.S3_BUCKET_ACCESS_KEY ?? "AKIA55IGFKLCGNSIHZWT";
const S3_BUCKET_SECRET_ACCESS_KEY_FILE =
  process.env.S33_BUCKET_SECRET_ACCESS_KEY_FILE ??
  "/run/secrets/s3-bucket-secret-access-key";
const S3_BUCKET_SECRET_ACCESS_KEY = fs.readFileSync(
  S3_BUCKET_SECRET_ACCESS_KEY_FILE,
  "utf-8"
);

const s3 = new S3Client({
  credentials: {
    accessKeyId: S3_BUCKET_ACCESS_KEY,
    secretAccessKey: S3_BUCKET_SECRET_ACCESS_KEY,
  },
  region: S3_BUCKET_REGION,
});

const contentType = "image/png";

for (const heroItem of heroItems) {
  const {
    name,
    biography,
    identity,
    description,
    complexity,
    attack_type: attackType,
    primary_attribute: primaryAttribute,
    roles,
    abilities,
    talents,
  } = heroItem;
  const { percentages } = heroMetaInfoItems.filter(
    (heroMetaInfoItem: {
      name: string;
      percentages: Array<{ rank: string; type: string; percentage: string }>;
    }) => name.includes(heroMetaInfoItem.name)
  )[0];
  const heroEntry: Hero = {
    name,
    biography,
    identity,
    description,
    complexity,
    attackType,
    primaryAttribute,
  };
  const insertedHero: Hero[] = await db
    .insert(hero)
    .values(heroEntry)
    .onConflictDoUpdate({
      target: hero.name,
      set: heroEntry,
    })
    .returning();
  const insertedHeroName: string =
    insertedHero[0].name
      .toLowerCase()
      .replaceAll(" ", "_")
      .replaceAll(",", "") ?? "";
  const insertedHeroId: number = insertedHero[0].id ?? 0;
  const heroImage = heroImages.filter((hero) =>
    insertedHeroName.includes(hero.replace(".png", ""))
  )[0];
  const heroSelectionImage = heroSelectionImages.filter((hero) =>
    insertedHeroName.includes(hero.replace(".png", ""))
  )[0];
  if (heroSelectionImage === undefined || heroSelectionImage === "wisp.png") {
    console.log(heroSelectionImage);
  }
  const uploadHeroImageCommand = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: heroImage,
    Body: fs.readFileSync(path.join("images/heroes", heroImage)),
    ContentType: contentType,
  });
  const uploadHeroSelectionImageCommand = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: heroSelectionImage.replace(".png", "_2.png"),
    Body: fs.readFileSync(path.join("images/heroes2", heroSelectionImage)),
    ContentType: contentType,
  });
  // await s3.send(uploadHeroImageCommand);
  // await s3.send(uploadHeroSelectionImageCommand);
  for (const role of roles) {
    const heroRoleEntry: HeroRole = {
      heroId: insertedHeroId,
      type: role,
    };
    await db
      .insert(heroRole)
      .values(heroRoleEntry)
      .onConflictDoUpdate({
        target: [heroRole.heroId, heroRole.type],
        set: heroRoleEntry,
      });
  }
  for (const ability of abilities) {
    const {
      name,
      lore,
      description,
      features: {
        ability_type: abilityType,
        affected_target: affectedTarget,
        damage_type: damageType,
      },
      upgrades,
    } = ability;
    let hasShardUpgrade = false;
    let hasScepterUpgrade = false;
    if (upgrades !== null) {
      for (const upgrade of upgrades) {
        if (upgrade.type === "Shard") {
          hasShardUpgrade = true;
        } else if (upgrade.type === "Scepter") {
          hasScepterUpgrade = true;
        }
      }
    }
    const heroAbilityEntry: HeroAbility = {
      heroId: insertedHeroId,
      name,
      lore,
      description,
      abilityType,
      damageType,
      affectedTarget,
      hasShardUpgrade,
      hasScepterUpgrade,
    };
    const insertedHeroAbility: HeroAbility[] = await db
      .insert(heroAbility)
      .values(heroAbilityEntry)
      .onConflictDoUpdate({
        target: [heroAbility.heroId, heroAbility.name],
        set: heroAbilityEntry,
      })
      .returning();
    const insertedHeroAbilityName: string =
      insertedHeroAbility[0].name
        .toLowerCase()
        .replaceAll(" ", "_")
        .replaceAll(",", "") ?? "";
    const insertedHeroAbilityId: number = insertedHeroAbility[0].id ?? 0;
    const heroAbilityImage = abilityImages.filter((ability) =>
      ability.includes(insertedHeroAbilityName)
    )[0];
    const uploadHeroAbilityImageCommand = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: heroAbilityImage,
      Body: fs.readFileSync(path.join("images/abilities", heroAbilityImage)),
      ContentType: contentType,
    });
    // await s3.send(uploadHeroAbilityImageCommand);
    if (upgrades !== null) {
      for (const upgrade of upgrades) {
        const { type, description } = upgrade;
        const heroAbilityUpgradeEntry: HeroAbilityUpgrade = {
          abilityId: insertedHeroAbilityId,
          type,
          description,
        };
        await db
          .insert(heroAbilityUpgrade)
          .values(heroAbilityUpgradeEntry)
          .onConflictDoUpdate({
            target: [heroAbilityUpgrade.abilityId, heroAbilityUpgrade.type],
            set: heroAbilityUpgradeEntry,
          });
      }
    }
  }
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
  };
  const insertedItem: Item[] = await db
    .insert(item)
    .values(itemEntry)
    .onConflictDoUpdate({
      target: item.name,
      set: itemEntry,
    })
    .returning();
  const insertedItemName: string =
    insertedItem[0].name
      .toLowerCase()
      .replaceAll(" ", "_")
      .replaceAll(",", "") ?? "";
  const insertedItemId: number = insertedItem[0].id ?? 0;
  const itemImage = itemImages.filter((ability) =>
    ability.includes(insertedItemName)
  )[0];
  const uploadItemImageCommand = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: itemImage,
    Body: fs.readFileSync(path.join("images/items", itemImage)),
    ContentType: contentType,
  });
  // await s3.send(uploadItemImageCommand);
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
