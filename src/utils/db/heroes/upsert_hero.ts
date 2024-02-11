/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { hero } from "../../../db/schemas/heroes/hero";
import { getHeroImages } from "../../s3/hero_images";
import upsertHeroRoles from "./upsert_hero_roles";
import upsertHeroAbilities from "./upsert_hero_abilities";
import upsertHeroTalents from "./upsert_hero_talents";
import upsertHeroMetaInfo from "./upsert_hero_meta_info";

interface Hero {
  id?: number;
  name: string;
  alias: string;
  biography: string;
  identity: string;
  description: string;
  complexity: "Simple" | "Moderate" | "Complex";
  attackType: "Melee" | "Ranged";
  primaryAttribute: "Strength" | "Agility" | "Intelligence" | "Universal";
  primaryImageKey: string;
  secondaryImageKey: string;
}

const upsertHero = async (
  db: any,
  heroItem: any,
  heroMetaInfoItems: any
): Promise<void> => {
  const {
    name,
    alias,
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

  const [heroPrimaryImage, heroSecondaryImage] = await getHeroImages(alias);

  const primaryImageKey = heroPrimaryImage;
  const secondaryImageKey = heroSecondaryImage.replace(".png", "_2.png");

  const heroEntry: Hero = {
    name,
    alias,
    biography,
    identity,
    description,
    complexity,
    attackType,
    primaryAttribute,
    primaryImageKey,
    secondaryImageKey,
  };

  const insertedHero: Hero[] = await db
    .insert(hero)
    .values(heroEntry)
    .onConflictDoUpdate({
      target: hero.name,
      set: heroEntry,
    })
    .returning();

  console.log(insertedHero);

  const insertedHeroId: number = insertedHero[0].id ?? 0;

  await upsertHeroRoles(db, insertedHeroId, roles);

  await upsertHeroAbilities(db, insertedHeroId, alias, abilities);

  await upsertHeroTalents(db, insertedHeroId, talents);

  await upsertHeroMetaInfo(db, insertedHeroId, percentages);
};

export default upsertHero;
