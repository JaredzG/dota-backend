/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { itemStat } from "../../../db/schemas/items/itemStat";

interface ItemStat {
  id?: number;
  itemId: number;
  effect: string;
}

const upsertItemStats = async (
  db: any,
  itemId: any,
  stats: any
): Promise<void> => {
  if (stats !== null) {
    for (const stat of stats) {
      const itemStatEntry: ItemStat = {
        itemId,
        effect: stat,
      };

      await db
        .insert(itemStat)
        .values(itemStatEntry)
        .onConflictDoUpdate({
          target: [itemStat.itemId, itemStat.effect],
          set: itemStatEntry,
        });
    }
  }
};

export default upsertItemStats;
