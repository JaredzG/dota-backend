import {
  heroTalent,
  insertHeroTalentSchema,
  type HeroTalent,
} from "../../../db/schemas/heroes/heroTalent";
import { type DB } from "../../../db/db";

const insertHeroTalents = async (
  db: DB,
  heroId: number,
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
        })
        .returning();

      console.log(insertedHeroTalent[0]);
    }
  }
};

export default insertHeroTalents;
