import {
  heroAbilityFeature,
  insertHeroAbilityFeatureSchema,
  type HeroAbilityFeature,
} from "../../../db/schemas/heroes/heroAbilityFeature";
import { type DB } from "../../../db/db";

const insertHeroAbilityFeatures = async (
  db: DB,
  heroAbilityId: number,
  features: any
): Promise<void> => {
  for (const feature in features) {
    const values = features[feature];

    if (values !== null) {
      for (const value of values) {
        const heroAbilityFeatureEntry = {
          heroAbilityId,
          type: feature.slice(0, -1),
          value,
        };

        if (
          insertHeroAbilityFeatureSchema.safeParse(heroAbilityFeatureEntry)
            .success
        ) {
          const insertedHeroAbilityFeature: HeroAbilityFeature[] = await db
            .insert(heroAbilityFeature)
            .values(heroAbilityFeatureEntry)
            .onConflictDoUpdate({
              target: [
                heroAbilityFeature.heroAbilityId,
                heroAbilityFeature.type,
              ],
              set: heroAbilityFeatureEntry,
            })
            .returning();

          console.log(insertedHeroAbilityFeature[0]);
        }
      }
    } else {
      const heroAbilityFeatureEntry = {
        heroAbilityId,
        type: feature.slice(0, -1),
        value: null,
      };

      if (
        insertHeroAbilityFeatureSchema.safeParse(heroAbilityFeatureEntry)
          .success
      ) {
        const insertedHeroAbilityFeature: HeroAbilityFeature[] = await db
          .insert(heroAbilityFeature)
          .values(heroAbilityFeatureEntry)
          .onConflictDoUpdate({
            target: [heroAbilityFeature.heroAbilityId, heroAbilityFeature.type],
            set: heroAbilityFeatureEntry,
          })
          .returning();

        console.log(insertedHeroAbilityFeature[0]);
      }
    }
  }
};

export default insertHeroAbilityFeatures;
