/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  heroRole,
  insertHeroRoleSchema,
  type HeroRole,
} from "../../../db/schemas/heroes/heroRole";

const upsertHeroRoles = async (
  db: any,
  heroId: any,
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
        });

      console.log(insertedHeroRole[0]);
    }
  }
};

export default upsertHeroRoles;
