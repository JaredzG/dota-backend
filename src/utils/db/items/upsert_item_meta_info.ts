/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { itemMetaInfo } from "../../../db/schema";
import upsertItemMetaInfoPercentages from "./upsert_item_meta_info_percentages";

interface ItemMetaInfo {
  id?: number;
  itemId: number;
  uses: string;
}

const upsertItemMetaInfo = async (
  db: any,
  itemId: any,
  uses: any,
  percentages: any
): Promise<void> => {
  const itemMetaInfoEntry: ItemMetaInfo = {
    itemId,
    uses,
  };

  const insertedItemMetaInfo: ItemMetaInfo[] = await db
    .insert(itemMetaInfo)
    .values(itemMetaInfoEntry)
    .onConflictDoUpdate({
      target: itemMetaInfo.itemId,
      set: itemMetaInfoEntry,
    })
    .returning();

  const insertedItemMetaInfoId: number = insertedItemMetaInfo[0].id ?? 0;

  await upsertItemMetaInfoPercentages(db, insertedItemMetaInfoId, percentages);
};

export default upsertItemMetaInfo;
