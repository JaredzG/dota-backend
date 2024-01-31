/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { heroAbility } from "../../../db/schema";
import { getHeroAbilityImage } from "../../s3/hero_ability_images";
import upsertHeroAbilityUpgrades from "./upsert_hero_ability_upgrades";

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
  imageUrl: string | null;
}

const upsertHeroAbilities = async (
  db: any,
  heroId: any,
  heroName: any,
  abilities: any,
  s3: any,
  s3BucketName: any
): Promise<void> => {
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

    const heroAbilityImage = await getHeroAbilityImage(heroName, name);

    const getHeroAbilityImageCommand = new GetObjectCommand({
      Bucket: s3BucketName,
      Key: heroAbilityImage,
    });

    const imageUrl = await getSignedUrl(s3, getHeroAbilityImageCommand);

    const heroAbilityEntry: HeroAbility = {
      heroId,
      name,
      lore,
      description,
      abilityType,
      damageType,
      affectedTarget,
      hasShardUpgrade,
      hasScepterUpgrade,
      imageUrl,
    };

    const insertedHeroAbility: HeroAbility[] = await db
      .insert(heroAbility)
      .values(heroAbilityEntry)
      .onConflictDoUpdate({
        target: [heroAbility.heroId, heroAbility.name],
        set: heroAbilityEntry,
      })
      .returning();

    const insertedHeroAbilityId: number = insertedHeroAbility[0].id ?? 0;

    await upsertHeroAbilityUpgrades(db, insertedHeroAbilityId, upgrades);
  }
};

export default upsertHeroAbilities;
