import {
  itemMetaInfo,
  insertItemMetaInfoSchema,
  type ItemMetaInfo,
} from "../../../db/schemas/items/itemMetaInfo";
import insertItemMetaInfoPercentages from "./insertItemMetaInfoPercentages";
import { type DB } from "../../../db/db";

const insertItemMetaInfo = async (
  db: DB,
  itemId: number,
  uses: string,
  percentages: any
): Promise<void> => {
  const itemMetaInfoEntry = {
    itemId,
    uses: parseInt(uses),
  };

  if (insertItemMetaInfoSchema.safeParse(itemMetaInfoEntry).success) {
    const insertedItemMetaInfo: ItemMetaInfo[] = await db
      .insert(itemMetaInfo)
      .values(itemMetaInfoEntry)
      .onConflictDoUpdate({
        target: itemMetaInfo.itemId,
        set: itemMetaInfoEntry,
      })
      .returning();

    console.log(insertedItemMetaInfo[0]);

    const insertedItemMetaInfoId: number = insertedItemMetaInfo[0].id ?? 0;

    await insertItemMetaInfoPercentages(
      db,
      insertedItemMetaInfoId,
      percentages
    );
  }
};

export default insertItemMetaInfo;
