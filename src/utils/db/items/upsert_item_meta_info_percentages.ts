/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { itemMetaInfoPercentage } from "../../../db/schema";

interface ItemMetaInfoPercentage {
  id?: number;
  itemMetaInfoId: number;
  type: "Use Percentage" | "Win Percentage";
  percentage: string;
}

const upsertItemMetaInfoPercentages = async (
  db: any,
  itemMetaInfoId: any,
  percentages: any
): Promise<void> => {
  for (const metaPercentage of percentages) {
    const { type, percentage } = metaPercentage;

    const itemMetaInfoPercentageEntry: ItemMetaInfoPercentage = {
      itemMetaInfoId,
      type,
      percentage,
    };

    await db
      .insert(itemMetaInfoPercentage)
      .values(itemMetaInfoPercentageEntry)
      .onConflictDoUpdate({
        target: [
          itemMetaInfoPercentage.itemMetaInfoId,
          itemMetaInfoPercentage.type,
        ],
        set: itemMetaInfoPercentageEntry,
      });
  }
};

export default upsertItemMetaInfoPercentages;
