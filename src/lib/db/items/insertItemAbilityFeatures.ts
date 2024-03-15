import {
  itemAbilityFeature,
  insertItemAbilityFeatureSchema,
  type ItemAbilityFeature,
} from "../../../db/schemas/items/itemAbilityFeature";
import { type DB } from "../../../db/db";

const insertItemAbilityFeatures = async (
  db: DB,
  itemAbilityId: number,
  features: any
): Promise<void> => {
  for (const abilityFeature in features) {
    const values = features[abilityFeature];
    const feature = abilityFeature
      .split("_")
      .map((value: string) => value[0].toUpperCase() + value.slice(1))
      .join(" ")
      .slice(0, -1);

    if (values !== null) {
      for (const value of values) {
        const itemAbilityFeatureEntry = {
          itemAbilityId,
          type: feature,
          value,
        };

        if (
          insertItemAbilityFeatureSchema.safeParse(itemAbilityFeatureEntry)
            .success
        ) {
          const insertedItemAbilityFeature: ItemAbilityFeature[] = await db
            .insert(itemAbilityFeature)
            .values(itemAbilityFeatureEntry)
            .onConflictDoUpdate({
              target: [
                itemAbilityFeature.itemAbilityId,
                itemAbilityFeature.type,
              ],
              set: itemAbilityFeatureEntry,
            })
            .returning();

          console.log(insertedItemAbilityFeature[0]);
        }
      }
    } else {
      const itemAbilityFeatureEntry = {
        itemAbilityId,
        type: feature,
        value: null,
      };

      if (
        insertItemAbilityFeatureSchema.safeParse(itemAbilityFeatureEntry)
          .success
      ) {
        const insertedItemAbilityFeature: ItemAbilityFeature[] = await db
          .insert(itemAbilityFeature)
          .values(itemAbilityFeatureEntry)
          .onConflictDoUpdate({
            target: [itemAbilityFeature.itemAbilityId, itemAbilityFeature.type],
            set: itemAbilityFeatureEntry,
          })
          .returning();

        console.log(insertedItemAbilityFeature[0]);
      }
    }
  }
};

export default insertItemAbilityFeatures;
