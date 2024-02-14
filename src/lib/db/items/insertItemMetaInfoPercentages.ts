import {
  itemMetaInfoPercentage,
  insertItemMetaInfoPercentageSchema,
  type ItemMetaInfoPercentage,
} from "../../../db/schemas/items/itemMetaInfoPercentage";
import { type DB } from "../../../db/db";

const insertItemMetaInfoPercentages = async (
  db: DB,
  itemMetaInfoId: number,
  percentages: any
): Promise<void> => {
  for (const metaPercentage of percentages) {
    const { type, percentage } = metaPercentage;

    const itemMetaInfoPercentageEntry = {
      itemMetaInfoId,
      type,
      percentage,
    };

    if (
      insertItemMetaInfoPercentageSchema.safeParse(itemMetaInfoPercentageEntry)
        .success
    ) {
      const insertedItemMetaInfoPercentage: ItemMetaInfoPercentage[] = await db
        .insert(itemMetaInfoPercentage)
        .values(itemMetaInfoPercentageEntry)
        .onConflictDoUpdate({
          target: [
            itemMetaInfoPercentage.itemMetaInfoId,
            itemMetaInfoPercentage.type,
          ],
          set: itemMetaInfoPercentageEntry,
        })
        .returning();

      console.log(insertedItemMetaInfoPercentage[0]);
    }
  }
};

export default insertItemMetaInfoPercentages;
