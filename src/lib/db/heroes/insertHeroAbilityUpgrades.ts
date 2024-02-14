import {
  heroAbilityUpgrade,
  insertHeroAbilityUpgradeSchema,
  type HeroAbilityUpgrade,
} from "../../../db/schemas/heroes/heroAbilityUpgrade";
import { type DB } from "../../../db/db";

const insertHeroAbilityUpgrades = async (
  db: DB,
  abilityId: number,
  upgrades: any
): Promise<void> => {
  if (upgrades !== null) {
    for (const upgrade of upgrades) {
      const { type, description } = upgrade;

      const heroAbilityUpgradeEntry = {
        abilityId,
        type,
        description,
      };

      if (
        insertHeroAbilityUpgradeSchema.safeParse(heroAbilityUpgradeEntry)
          .success
      ) {
        const insertedHeroAbilityUpgrade: HeroAbilityUpgrade[] = await db
          .insert(heroAbilityUpgrade)
          .values(heroAbilityUpgradeEntry)
          .onConflictDoUpdate({
            target: [heroAbilityUpgrade.abilityId, heroAbilityUpgrade.type],
            set: heroAbilityUpgradeEntry,
          })
          .returning();

        console.log(insertedHeroAbilityUpgrade[0]);
      }
    }
  }
};

export default insertHeroAbilityUpgrades;
