import {
  itemAbility,
  insertItemAbilitySchema,
  type ItemAbility,
} from "../../../db/schemas/items/itemAbility";
import { type DB } from "../../../db/db";

const insertItemAbilities = async (
  db: DB,
  itemId: number,
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

      const itemAbilityEntry = {
        itemId,
        name,
        description,
        abilityType,
        affectedTarget,
        damageType,
      };

      if (insertItemAbilitySchema.safeParse(itemAbilityEntry).success) {
        const insertedItemAbility: ItemAbility[] = await db
          .insert(itemAbility)
          .values(itemAbilityEntry)
          .onConflictDoUpdate({
            target: [itemAbility.itemId, itemAbility.name],
            set: itemAbilityEntry,
          })
          .returning();

        console.log(insertedItemAbility[0]);
      }
    }
  }
};

export default insertItemAbilities;
