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
  for (const feature in features) {
    const values = features[feature];

    if (values !== null) {
      for (const value of values) {
        const itemAbilityFeatureEntry = {
          itemAbilityId,
          type: feature.slice(0, -1),
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
        type: feature.slice(0, -1),
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
