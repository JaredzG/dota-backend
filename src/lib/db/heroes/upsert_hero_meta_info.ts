/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  heroMetaInfo,
  insertHeroMetaInfoSchema,
  type HeroMetaInfo,
} from "../../../db/schemas/heroes/heroMetaInfo";

const upsertHeroMetaInfo = async (
  db: any,
  heroId: any,
  percentages: any
): Promise<void> => {
  for (const metaPercentage of percentages) {
    const { rank, type, percentage } = metaPercentage;

    const heroMetaInfoEntry = {
      heroId,
      rank,
      type,
      percentage,
    };

    if (insertHeroMetaInfoSchema.safeParse(heroMetaInfoEntry).success) {
      const insertedHeroMetaInfo: HeroMetaInfo[] = await db
        .insert(heroMetaInfo)
        .values(heroMetaInfoEntry)
        .onConflictDoUpdate({
          target: [heroMetaInfo.heroId, heroMetaInfo.rank, heroMetaInfo.type],
          set: heroMetaInfoEntry,
        });

      console.log(insertedHeroMetaInfo[0]);
    }
  }
};

export default upsertHeroMetaInfo;
