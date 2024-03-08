import {
  heroAbility,
  insertHeroAbilitySchema,
  type HeroAbility,
} from "../../../db/schemas/heroes/heroAbility";
import { getHeroAbilityImage } from "../../s3/heroAbilityImages";
import insertHeroAbilityUpgrades from "./insertHeroAbilityUpgrades";
import { type DB } from "../../../db/db";
import insertHeroAbilityFeatures from "./insertHeroAbilityFeatures";

const insertHeroAbilities = async (
  db: DB,
  heroId: number,
  heroName: string,
  abilities: any
): Promise<void> => {
  for (const ability of abilities) {
    const { name, lore, description, features, upgrades } = ability;
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

    const heroAbilityImage = await getHeroAbilityImage(
      heroName,
      name as string
    );

    const imageKey = heroAbilityImage;

    const heroAbilityEntry = {
      heroId,
      name,
      lore,
      description,
      hasShardUpgrade,
      hasScepterUpgrade,
      imageKey,
    };

    if (insertHeroAbilitySchema.safeParse(heroAbilityEntry).success) {
      const insertedHeroAbility: HeroAbility[] = await db
        .insert(heroAbility)
        .values(heroAbilityEntry)
        .onConflictDoUpdate({
          target: [heroAbility.heroId, heroAbility.name],
          set: heroAbilityEntry,
        })
        .returning();

      console.log(insertedHeroAbility[0]);

      const insertedHeroAbilityId: number = insertedHeroAbility[0].id ?? 0;

      await insertHeroAbilityFeatures(db, insertedHeroAbilityId, features);

      await insertHeroAbilityUpgrades(db, insertedHeroAbilityId, upgrades);
    }
  }
};

export default insertHeroAbilities;
