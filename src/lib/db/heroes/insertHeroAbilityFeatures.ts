import {
  heroAbilityFeature,
  insertHeroAbilityFeatureSchema,
  type HeroAbilityFeature,
  type heroAbilityFeatureTypeEnum,
  type heroAbilityFeatureValueEnum,
} from "../../../db/schemas/heroes/heroAbilityFeature";
import { type DB } from "../../../db/db";

const insertHeroAbilityFeatures = async (
  db: DB,
  heroAbilityId: number,
  features: any
): Promise<void> => {
  for (const abilityFeature in features) {
    const values = features[abilityFeature];
    const feature = abilityFeature
      .split("_")
      .map((value: string) => value[0].toUpperCase() + value.slice(1))
      .join(" ")
      .slice(0, -1);
    if (values !== null) {
      for (const value of values) {
        const heroAbilityFeatureEntry: {
          heroAbilityId: number;
          type: (typeof heroAbilityFeatureTypeEnum.enumValues)[number];
          value: (typeof heroAbilityFeatureValueEnum.enumValues)[number] | null;
        } = {
          heroAbilityId,
          type: feature,
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
      const heroAbilityFeatureEntry: {
        heroAbilityId: number;
        type: (typeof heroAbilityFeatureTypeEnum.enumValues)[number];
        value: (typeof heroAbilityFeatureValueEnum.enumValues)[number] | null;
      } = {
        heroAbilityId,
        type: feature,
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
