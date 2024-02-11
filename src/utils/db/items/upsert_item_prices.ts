/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { itemPrice } from "../../../db/schemas/items/itemPrice";

interface ItemPrice {
  id?: number;
  itemId: number;
  type: "Purchase Price" | "Sell Price";
  amount: string;
}

const upsertItemPrices = async (
  db: any,
  itemId: any,
  prices: any
): Promise<void> => {
  if (prices !== null) {
    for (const price of prices) {
      const { type, amount } = price;

      const itemPriceEntry: ItemPrice = {
        itemId,
        type,
        amount,
      };

      await db
        .insert(itemPrice)
        .values(itemPriceEntry)
        .onConflictDoUpdate({
          target: [itemPrice.itemId, itemPrice.type],
          set: itemPriceEntry,
        });
    }
  }
};

export default upsertItemPrices;
