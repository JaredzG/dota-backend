/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  heroAbilityUpgrade,
  insertHeroAbilityUpgradeSchema,
  type HeroAbilityUpgrade,
} from "../../../db/schemas/heroes/heroAbilityUpgrade";

const upsertHeroAbilityUpgrades = async (
  db: any,
  abilityId: any,
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

export default upsertHeroAbilityUpgrades;
