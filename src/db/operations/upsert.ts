import * as fs from "fs";
import { connectDB, createPool } from "../db";
import {
  hero,
  heroAbility,
  heroAbilityUpgrade,
  heroMetaInfo,
  heroRole,
  heroTalent,
} from "../schema";

interface Hero {
  id?: number;
  name: string;
  biography: string;
  identity: string;
  description: string;
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
  type: "Shard" | "Scepter";
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
  type: "Pick_Percentage" | "Win_Percentage";
  rank:
    | "Herald_Guardian_Crusader"
    | "Archon"
    | "Legend"
    | "Ancient"
    | "Divine_Immortal";
  percentage: string;
}

const heroesFilePath = "data/heroes.json";
const itemsFilePath = "data/items.json";
const heroesMetaFilePath = "data/heroes.meta.json";
const itemsMetaFilePath = "data/items.meta.json";

const heroItems = JSON.parse(fs.readFileSync(heroesFilePath, "utf-8"));
// const itemItems = JSON.parse(fs.readFileSync(itemsFilePath, "utf-8"));
const heroMetaInfoItems = JSON.parse(
  fs.readFileSync(heroesMetaFilePath, "utf-8")
);
// const itemMetaInfoItems = JSON.parse(fs.readFileSync(itemsMetaFilePath, "utf-8"));
const pool = createPool();
const db = connectDB(pool);
for (let heroItem of heroItems) {
  const {
    name: heroName,
    biography,
    identity,
    description,
    primary_attribute: primaryAttribute,
    roles,
    abilities,
    talents,
  } = heroItem;
  const { percentages: heroMetaPercentages } = heroMetaInfoItems.filter(
    (heroMetaInfoItem) => heroName.includes(heroMetaInfoItem["name"])
  )[0];
  const heroEntry: Hero = {
    name: heroName,
    biography,
    identity,
    description,
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
  const insertedHeroId: number = insertedHero[0].id as number;
  for (let role of roles) {
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
  for (let ability of abilities) {
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
      for (let upgrade of upgrades) {
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
    const insertedHeroAbilityId: number = insertedHeroAbility[0].id as number;
    if (upgrades !== null) {
      for (let upgrade of upgrades) {
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
  for (let talent of talents) {
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
  for (let metaPercentage of heroMetaPercentages) {
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
await pool.end();
