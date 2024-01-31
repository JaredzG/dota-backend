/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { heroAbilityUpgrade } from "../../../db/schema";

interface HeroAbilityUpgrade {
  id?: number;
  abilityId: number;
  type: "Shard Upgrade" | "Scepter Upgrade";
  description: string;
}

const upsertHeroAbilityUpgrades = async (
  db: any,
  abilityId: any,
  upgrades: any
): Promise<void> => {
  if (upgrades !== null) {
    for (const upgrade of upgrades) {
      const { type, description } = upgrade;

      const heroAbilityUpgradeEntry: HeroAbilityUpgrade = {
        abilityId,
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
};

export default upsertHeroAbilityUpgrades;
