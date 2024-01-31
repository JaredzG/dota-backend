/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { item } from "../../../db/schema";
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
  imageUrl: string | null;
}

const upsertItem = async (
  db: any,
  s3: any,
  s3BucketName: any,
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

  const getItemImageCommand = new GetObjectCommand({
    Bucket: s3BucketName,
    Key: itemImage,
  });

  const imageUrl = await getSignedUrl(s3, getItemImageCommand);

  const itemEntry: Item = {
    name,
    lore,
    type,
    classification,
    hasStats,
    hasAbilities,
    hasPrices,
    hasComponents,
    imageUrl,
  };

  const insertedItem: Item[] = await db
    .insert(item)
    .values(itemEntry)
    .onConflictDoUpdate({
      target: item.name,
      set: itemEntry,
    })
    .returning();

  const insertedItemId: number = insertedItem[0].id ?? 0;

  await upsertItemStats(db, insertedItemId, stats);

  await upsertItemAbilities(db, insertedItemId, abilities);

  await upsertItemPrices(db, insertedItemId, prices);

  await upsertItemComponents(db, insertedItemId, components);

  await upsertItemMetaInfo(db, insertedItemId, uses, percentages);
};

export default upsertItem;
