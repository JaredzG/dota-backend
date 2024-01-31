/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { heroMetaInfo } from "../../../db/schema";

interface HeroMetaInfo {
  id?: number;
  heroId: number;
  type: "Pick Percentage" | "Win Percentage";
  rank:
    | "Herald / Guardian / Crusader"
    | "Archon"
    | "Legend"
    | "Ancient"
    | "Divine / Immortal";
  percentage: string;
}

const upsertHeroMetaInfo = async (
  db: any,
  heroId: any,
  percentages: any
): Promise<void> => {
  for (const metaPercentage of percentages) {
    const { rank, type, percentage } = metaPercentage;

    const heroMetaInfoEntry: HeroMetaInfo = {
      heroId,
      rank,
      type,
      percentage,
    };

    await db
      .insert(heroMetaInfo)
      .values(heroMetaInfoEntry)
      .onConflictDoUpdate({
        target: [heroMetaInfo.heroId, heroMetaInfo.rank, heroMetaInfo.type],
        set: heroMetaInfoEntry,
      });
  }
};

export default upsertHeroMetaInfo;
