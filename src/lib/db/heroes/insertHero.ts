import {
  hero,
  insertHeroSchema,
  type Hero,
} from "../../../db/schemas/heroes/hero";
import { getHeroImages } from "../../s3/heroImages";
import insertHeroRoles from "./insertHeroRoles";
import insertHeroAbilities from "./insertHeroAbilities";
import insertHeroTalents from "./insertHeroTalents";
import insertHeroMetaInfo from "./insertHeroMetaInfo";
import { type DB } from "../../../db/db";

const insertHero = async (
  db: DB,
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

  const [heroPrimaryImage, heroSecondaryImage] = await getHeroImages(
    alias as string
  );

  const primaryImageKey = heroPrimaryImage;
  const secondaryImageKey = heroSecondaryImage.replace(".png", "_2.png");

  const heroEntry = {
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

  if (insertHeroSchema.safeParse(heroEntry).success) {
    const insertedHero: Hero[] = await db
      .insert(hero)
      .values(heroEntry)
      .onConflictDoUpdate({
        target: hero.name,
        set: heroEntry,
      })
      .returning();

    console.log(insertedHero[0]);

    const insertedHeroId: number = insertedHero[0].id ?? 0;

    await insertHeroRoles(db, insertedHeroId, roles);

    await insertHeroAbilities(db, insertedHeroId, alias as string, abilities);

    await insertHeroTalents(db, insertedHeroId, talents);

    await insertHeroMetaInfo(db, insertedHeroId, percentages);
  }
};

export default insertHero;
