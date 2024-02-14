import {
  itemComponent,
  insertItemComponentSchema,
  type ItemComponent,
} from "../../../db/schemas/items/itemComponent";
import { type DB } from "../../../db/db";

const insertItemComponents = async (
  db: DB,
  itemId: number,
  components: any
): Promise<void> => {
  if (components !== null) {
    for (const component of components) {
      const { name, amount, price } = component;

      const itemComponentEntry = {
        itemId,
        name,
        amount,
        price,
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
};

export default insertItemComponents;
