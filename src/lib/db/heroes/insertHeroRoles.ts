import {
  heroRole,
  insertHeroRoleSchema,
  type HeroRole,
} from "../../../db/schemas/heroes/heroRole";
import { type DB } from "../../../db/db";

const insertHeroRoles = async (
  db: DB,
  heroId: number,
  roles: any
): Promise<void> => {
  for (const role of roles) {
    const heroRoleEntry = {
      heroId,
      type: role,
    };

    if (insertHeroRoleSchema.safeParse(heroRoleEntry).success) {
      const insertedHeroRole: HeroRole[] = await db
        .insert(heroRole)
        .values(heroRoleEntry)
        .onConflictDoUpdate({
          target: [heroRole.heroId, heroRole.type],
          set: heroRoleEntry,
        })
        .returning();

      console.log(insertedHeroRole[0]);
    }
  }
};

export default insertHeroRoles;
