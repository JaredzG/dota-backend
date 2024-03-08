import {
  itemAbility,
  insertItemAbilitySchema,
  type ItemAbility,
} from "../../../db/schemas/items/itemAbility";
import { type DB } from "../../../db/db";
import insertItemAbilityFeatures from "./insertItemAbilityFeatures";

const insertItemAbilities = async (
  db: DB,
  itemId: number,
  abilities: any
): Promise<void> => {
  if (abilities !== null) {
    for (const ability of abilities) {
      const { name, description, features } = ability;

      const itemAbilityEntry = {
        itemId,
        name,
        description,
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

        const insertedItemAbilityId: number = insertedItemAbility[0].id ?? 0;

        await insertItemAbilityFeatures(db, insertedItemAbilityId, features);
      }
    }
  }
};

export default insertItemAbilities;
