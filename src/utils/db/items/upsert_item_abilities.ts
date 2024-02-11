/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { itemAbility } from "../../../db/schemas/items/itemAbility";

interface ItemAbility {
  id?: number;
  itemId: number;
  name: string;
  description: string;
  abilityType: string;
  affectedTarget: string | null;
  damageType: string | null;
}

const upsertItemAbilities = async (
  db: any,
  itemId: any,
  abilities: any
): Promise<void> => {
  if (abilities !== null) {
    for (const ability of abilities) {
      const {
        name,
        description,
        features: {
          ability_type: abilityType,
          affected_target: affectedTarget,
          damage_type: damageType,
        },
      } = ability;

      const itemAbilityEntry: ItemAbility = {
        itemId,
        name,
        description,
        abilityType,
        affectedTarget,
        damageType,
      };

      await db
        .insert(itemAbility)
        .values(itemAbilityEntry)
        .onConflictDoUpdate({
          target: [itemAbility.itemId, itemAbility.name],
          set: itemAbilityEntry,
        });
    }
  }
};

export default upsertItemAbilities;
