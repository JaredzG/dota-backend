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
    component_tree: componentTree,
  } = itemItem;

  const { uses, percentages }: { uses: string; percentages: any } =
    itemMetaInfoItems.filter(
      (itemMetaInfoItem: {
        name: string;
        uses: string;
        percentages: Array<{ type: string; percentage: string }>;
      }) => itemMetaInfoItem.name === name
    )[0];

  let hasStats = false;
  let hasAbilities = false;
  let hasPrices = false;
  let isComponent = false;
  let hasComponents = false;
  let hasRecipe = false;

  if (stats !== null) {
    hasStats = true;
  }

  if (abilities !== null) {
    hasAbilities = true;
  }

  if (prices !== null) {
    hasPrices = true;
  }

  if (componentTree !== null) {
    if (componentTree.buildup !== null) {
      isComponent = true;
    }
    if (componentTree.base !== null) {
      hasComponents = true;
      if (
        componentTree.base.some(
          (component: any) => component.name === "Recipe"
        ) === true
      ) {
        hasRecipe = true;
      }
    }
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
    isComponent,
    hasComponents,
    hasRecipe,
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

    await insertItemComponents(db, insertedItemId, componentTree);

    await insertItemMetaInfo(db, insertedItemId, uses, percentages);
  }
};

export default insertItem;
