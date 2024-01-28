/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { hero } from "../../db/schema";
import { eq } from "drizzle-orm";
import upsertHeroRoles from "./upsert_hero_roles";
import { getHeroImages } from "../s3/hero_images";

interface Hero {
  id?: number;
  name: string;
  biography: string;
  identity: string;
  description: string;
  complexity: "Simple" | "Moderate" | "Complex";
  attackType: "Melee" | "Ranged";
  primaryAttribute: "Strength" | "Agility" | "Intelligence" | "Universal";
  primaryImageUrl: string | null;
  secondaryImageUrl: string | null;
}

const upsertHero = async (
  db: any,
  s3: any,
  heroItem: any,
  heroMetaInfoItems: any,
  s3BucketName: any
): Promise<void> => {
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

  const [heroPrimaryImage, heroSecondaryImage] = await getHeroImages(name);

  const getHeroPrimaryImageCommand = new GetObjectCommand({
    Bucket: s3BucketName,
    Key: heroPrimaryImage,
  });

  const getHeroSecondaryImageCommand = new GetObjectCommand({
    Bucket: s3BucketName,
    Key: heroSecondaryImage.replace(".png", "_2.png"),
  });

  const primaryImageUrl = await getSignedUrl(s3, getHeroPrimaryImageCommand);

  const secondaryImageUrl = await getSignedUrl(
    s3,
    getHeroSecondaryImageCommand
  );

  const heroEntry: Hero = {
    name,
    biography,
    identity,
    description,
    complexity,
    attackType,
    primaryAttribute,
    primaryImageUrl,
    secondaryImageUrl,
  };

  const insertedHero: Hero[] = await db
    .insert(hero)
    .values(heroEntry)
    .onConflictDoUpdate({
      target: hero.name,
      set: heroEntry,
    })
    .returning();

  const insertedHeroId: number = insertedHero[0].id ?? 0;

  const updatedHero = await db
    .update(hero)
    .set({
      primary_image_url: primaryImageUrl,
      secondary_image_url: secondaryImageUrl,
    })
    .where(eq(hero.id, insertedHeroId))
    .returning();

  const updatedHeroId: number = updatedHero[0].id ?? 0;

  await upsertHeroRoles(db, updatedHeroId, roles);
};

export default upsertHero;
