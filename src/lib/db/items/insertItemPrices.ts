import {
  itemPrice,
  insertItemPriceSchema,
  type ItemPrice,
} from "../../../db/schemas/items/itemPrice";
import { type DB } from "../../../db/db";

const insertItemPrices = async (
  db: DB,
  itemId: number,
  prices: any
): Promise<void> => {
  if (prices !== null) {
    for (const price of prices) {
      const { type, amount } = price;

      const itemPriceEntry = {
        itemId,
        type,
        amount,
      };

      if (insertItemPriceSchema.safeParse(itemPriceEntry).success) {
        const insertedItemPrice: ItemPrice[] = await db
          .insert(itemPrice)
          .values(itemPriceEntry)
          .onConflictDoUpdate({
            target: [itemPrice.itemId, itemPrice.type],
            set: itemPriceEntry,
          })
          .returning();

        console.log(insertedItemPrice[0]);
      }
    }
  }
};

export default insertItemPrices;
