import * as fs from "fs";
import { connectDB, createPool } from "../db";
import { hero, heroAbility, heroRole } from "../schema";

interface Hero {
  id?: number;
  name: string;
  biography: string;
  identity: string;
  description: string;
  primary_attribute: "Strength" | "Agility" | "Intelligence" | "Universal";
  herald_guardian_crusader_pick_percentage: string;
  herald_guardian_crusader_win_percentage: string;
  archon_pick_percentage: string;
  archon_win_percentage: string;
  legend_pick_percentage: string;
  legend_win_percentage: string;
  ancient_pick_percentage: string;
  ancient_win_percentage: string;
  divine_immortal_pick_percentage: string;
  divine_immortal_win_percentage: string;
}

interface HeroRole {
  id?: number;
  heroId: number;
  roleType:
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
  lore: string;
  description: string;
  abilityType: string;
  damageType: string;
  affectedTarget: string;
}

const heroesFilePath = "data/heroes.json";
const itemsFilePath = "data/items.json";
const heroesMetaFilePath = "data/heroes.meta.json";
const itemsMetaFilePath = "data/items.meta.json";

const heroes = JSON.parse(fs.readFileSync(heroesFilePath, "utf-8"));
const items = JSON.parse(fs.readFileSync(itemsFilePath, "utf-8"));
const heroesMeta = JSON.parse(fs.readFileSync(heroesMetaFilePath, "utf-8"));
const itemsMeta = JSON.parse(fs.readFileSync(itemsMetaFilePath, "utf-8"));
const pool = createPool();
const db = connectDB(pool);
const {
  name,
  biography,
  identity,
  description,
  primary_attribute,
  roles,
  abilities,
  talents,
} = heroes[111];
const {
  herald_guardian_crusader_pick_percentage,
  herald_guardian_crusader_win_percentage,
  archon_pick_percentage,
  archon_win_percentage,
  legend_pick_percentage,
  legend_win_percentage,
  ancient_pick_percentage,
  ancient_win_percentage,
  divine_immortal_pick_percentage,
  divine_immortal_win_percentage,
} = heroesMeta[120];
const heroEntry: Hero = {
  name,
  biography,
  identity,
  description,
  primary_attribute,
  herald_guardian_crusader_pick_percentage,
  herald_guardian_crusader_win_percentage,
  archon_pick_percentage,
  archon_win_percentage,
  legend_pick_percentage,
  legend_win_percentage,
  ancient_pick_percentage,
  ancient_win_percentage,
  divine_immortal_pick_percentage,
  divine_immortal_win_percentage,
};
console.log(heroEntry);
const insertedHero: Hero[] = await db
  .insert(hero)
  .values(heroEntry)
  .onConflictDoUpdate({
    target: hero.name,
    set: heroEntry,
  })
  .returning();
const insertedHeroId = insertedHero[0].id as number;
for (let role of roles) {
  const heroRoleEntry: HeroRole = {
    heroId: insertedHeroId,
    roleType: role,
  };
  await db
    .insert(heroRole)
    .values(heroRoleEntry)
    .onConflictDoUpdate({
      target: [heroRole.heroId, heroRole.roleType],
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
  const heroAbilityEntry: HeroAbility = {
    heroId: insertedHeroId,
    name,
    lore,
    description,
    abilityType,
    damageType,
    affectedTarget,
  };
  const insertedHeroAbility: HeroAbility[] = await db
    .insert(heroAbility)
    .values(heroAbilityEntry)
    .onConflictDoUpdate({
      target: [heroAbility.heroId, heroAbility.name],
      set: heroAbilityEntry,
    })
    .returning();
  if (Array.isArray(upgrades)) {
    // Write code to handle when there are ability upgrades.
  } else {
    // Write code to handle when there are no ability upgrades.
  }
}
// console.log(items[98]);
await pool.end();
