import {
  item,
  insertItemSchema,
  type Item,
} from "../../../db/schemas/items/item";
import { getItemImage } from "../../s3/itemImages";
import insertItemStats from "./insertItemStats";
import insertItemAbilities from "./insertItemAbilities";
import insertItemPrices from "./insertItemPrices";
import insertItemComponents from "./insertItemComponents";
import insertItemMetaInfo from "./insertItemMetaInfo";
import { type DB } from "../../../db/db";

const insertItem = async (
  db: DB,
  itemItem: any,
  itemMetaInfoItems: any
): Promise<void> => {
  const {
    name,
    lore,
    type,
    classification,
    stats,
    abilities,
    prices,
    components,
  } = itemItem;

  const { uses, percentages } = itemMetaInfoItems.filter(
    (itemMetaInfoItem: {
      name: string;
      uses: string;
      percentages: Array<{ type: string; percentage: string }>;
    }) => itemMetaInfoItem.name === name
  )[0];

  let hasStats = false;
  let hasAbilities = false;
  let hasPrices = false;
  let hasComponents = false;

  if (stats !== null) {
    hasStats = true;
  }

  if (abilities !== null) {
    hasAbilities = true;
  }

  if (prices !== null) {
    hasPrices = true;
  }

  if (components !== null) {
    hasComponents = true;
  }

  const itemImage = await getItemImage(name as string);

  const imageKey = itemImage;

  const itemEntry = {
    name,
    lore,
    type,
    classification,
    hasStats,
    hasAbilities,
    hasPrices,
    hasComponents,
    imageKey,
  };

  if (insertItemSchema.safeParse(itemEntry).success) {
    const insertedItem: Item[] = await db
      .insert(item)
      .values(itemEntry)
      .onConflictDoUpdate({
        target: item.name,
        set: itemEntry,
      })
      .returning();

    console.log(insertedItem[0]);

    const insertedItemId: number = insertedItem[0].id ?? 0;

    await insertItemStats(db, insertedItemId, stats);

    await insertItemAbilities(db, insertedItemId, abilities);

    await insertItemPrices(db, insertedItemId, prices);

    await insertItemComponents(db, insertedItemId, components);

    await insertItemMetaInfo(db, insertedItemId, uses as string, percentages);
  }
};

export default insertItem;
