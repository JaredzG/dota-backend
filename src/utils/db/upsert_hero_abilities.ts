/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as fs from "fs";
import path from "path";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { heroAbility } from "../../db/schema";

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
  abilities: any,
  heroMetaInfoItems: any,
  heroPrimaryImages: any,
  heroSecondaryImages: any,
  heroAbilityImages: any,
  s3: any,
  bucketName: any,
  contentType: any
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
      imageUrl: null,
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
    const heroAbilityImage = heroAbilityImages.filter((ability: any) =>
      ability.includes(insertedHeroAbilityName)
    )[0];
    const uploadHeroAbilityImageCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: heroAbilityImage,
      Body: fs.readFileSync(path.join("images/abilities", heroAbilityImage)),
      ContentType: contentType,
    });
    await s3.send(uploadHeroAbilityImageCommand);
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
};

export default upsertHeroAbilities;
