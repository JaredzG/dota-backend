import {
  itemComponent,
  insertItemComponentSchema,
  type ItemComponent,
} from "../../../db/schemas/items/itemComponent";
import { type DB } from "../../../db/db";

const insertItemComponents = async (
  db: DB,
  itemId: number,
  componentTree: any
): Promise<void> => {
  if (componentTree !== null) {
    for (const componentLevel in componentTree) {
      const level = componentLevel
        .split("_")
        .map((value: string) => value[0].toUpperCase() + value.slice(1))
        .join(" ");
      if (componentTree[componentLevel] !== null) {
        for (const component of componentTree[componentLevel]) {
          const { name, amount, price } = component;

          const itemComponentEntry = {
            itemId,
            name,
            amount: parseInt(amount),
            priceAmount: parseInt(price.price_amount),
            priceUnit: price.price_unit,
            level,
          };

          if (insertItemComponentSchema.safeParse(itemComponentEntry).success) {
            const insertedItemComponent: ItemComponent[] = await db
              .insert(itemComponent)
              .values(itemComponentEntry)
              .onConflictDoUpdate({
                target: [itemComponent.itemId, itemComponent.name],
                set: itemComponentEntry,
              })
              .returning();

            console.log(insertedItemComponent[0]);
          }
        }
      }
    }
  }
};

export default insertItemComponents;
