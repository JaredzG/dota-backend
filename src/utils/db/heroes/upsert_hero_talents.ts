/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { heroTalent } from "../../../db/schema";

interface HeroTalent {
  id?: number;
  heroId: number;
  level: "Novice" | "Intermediate" | "Advanced" | "Expert";
  type: string;
  effect: string;
}

const upsertHeroTalents = async (
  db: any,
  heroId: any,
  talents: any
): Promise<void> => {
  for (const talent of talents) {
    const { level, type, effect } = talent;

    const heroTalentEntry: HeroTalent = {
      heroId,
      level,
      type,
      effect,
    };

    await db
      .insert(heroTalent)
      .values(heroTalentEntry)
      .onConflictDoUpdate({
        target: [heroTalent.heroId, heroTalent.level, heroTalent.type],
        set: heroTalentEntry,
      });
  }
};

export default upsertHeroTalents;
