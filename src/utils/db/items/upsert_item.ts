/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { item } from "../../../db/schemas/items/item";
import { getItemImage } from "../../s3/item_images";
import upsertItemStats from "./upsert_item_stats";
import upsertItemAbilities from "./upsert_item_abilities";
import upsertItemPrices from "./upsert_item_prices";
import upsertItemComponents from "./upsert_item_components";
import upsertItemMetaInfo from "./upsert_item_meta_info";

interface Item {
  id?: number;
  name: string;
  lore: string | null;
  type: "Basic" | "Upgrade" | "Neutral";
  classification:
    | "Consumables"
    | "Attributes"
    | "Equipment"
    | "Miscellaneous"
    | "Secret"
    | "Accessories"
    | "Support"
    | "Magical"
    | "Armor"
    | "Weapons"
    | "Artifacts"
    | "Tier 1"
    | "Tier 2"
    | "Tier 3"
    | "Tier 4"
    | "Tier 5";
  hasStats: boolean;
  hasAbilities: boolean;
  hasPrices: boolean;
  hasComponents: boolean;
  imageKey: string;
}

const upsertItem = async (
  db: any,
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

  const itemImage = await getItemImage(name);

  const imageKey = itemImage;

  const itemEntry: Item = {
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

  const insertedItem: Item[] = await db
    .insert(item)
    .values(itemEntry)
    .onConflictDoUpdate({
      target: item.name,
      set: itemEntry,
    })
    .returning();

  console.log(insertedItem);

  const insertedItemId: number = insertedItem[0].id ?? 0;

  await upsertItemStats(db, insertedItemId, stats);

  await upsertItemAbilities(db, insertedItemId, abilities);

  await upsertItemPrices(db, insertedItemId, prices);

  await upsertItemComponents(db, insertedItemId, components);

  await upsertItemMetaInfo(db, insertedItemId, uses, percentages);
};

export default upsertItem;
