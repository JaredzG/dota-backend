/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  heroTalent,
  insertHeroTalentSchema,
  type HeroTalent,
} from "../../../db/schemas/heroes/heroTalent";

const upsertHeroTalents = async (
  db: any,
  heroId: any,
  talents: any
): Promise<void> => {
  for (const talent of talents) {
    const { level, type, effect } = talent;

    const heroTalentEntry = {
      heroId,
      level,
      type,
      effect,
    };

    if (insertHeroTalentSchema.safeParse(heroTalentEntry).success) {
      const insertedHeroTalent: HeroTalent[] = await db
        .insert(heroTalent)
        .values(heroTalentEntry)
        .onConflictDoUpdate({
          target: [heroTalent.heroId, heroTalent.level, heroTalent.type],
          set: heroTalentEntry,
        });

      console.log(insertedHeroTalent[0]);
    }
  }
};

export default upsertHeroTalents;
