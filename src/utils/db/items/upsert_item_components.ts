/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { itemComponent } from "../../../db/schema";

interface ItemComponent {
  id?: number;
  itemId: number;
  name: string;
  amount: string;
  price: string;
}

const upsertItemComponents = async (
  db: any,
  itemId: any,
  components: any
): Promise<void> => {
  if (components !== null) {
    for (const component of components) {
      const { name, amount, price } = component;

      const itemComponentEntry: ItemComponent = {
        itemId,
        name,
        amount,
        price,
      };

      await db
        .insert(itemComponent)
        .values(itemComponentEntry)
        .onConflictDoUpdate({
          target: [itemComponent.itemId, itemComponent.name],
          set: itemComponentEntry,
        });
    }
  }
};

export default upsertItemComponents;
