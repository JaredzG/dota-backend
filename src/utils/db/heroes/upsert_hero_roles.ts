/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { heroRole } from "../../../db/schemas/heroes/heroRole";

interface HeroRole {
  id?: number;
  heroId: number;
  type:
    | "Carry"
    | "Support"
    | "Nuker"
    | "Disabler"
    | "Durable"
    | "Escape"
    | "Pusher"
    | "Initiator";
}

const upsertHeroRoles = async (
  db: any,
  heroId: any,
  roles: any
): Promise<void> => {
  for (const role of roles) {
    const heroRoleEntry: HeroRole = {
      heroId,
      type: role,
    };

    await db
      .insert(heroRole)
      .values(heroRoleEntry)
      .onConflictDoUpdate({
        target: [heroRole.heroId, heroRole.type],
        set: heroRoleEntry,
      });
  }
};

export default upsertHeroRoles;
