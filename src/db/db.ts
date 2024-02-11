import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";
import * as heroSchema from "./schemas/heroes/hero";
import * as heroAbilitySchema from "./schemas/heroes/heroAbility";
import * as heroAbilityUpgradeSchema from "./schemas/heroes/heroAbilityUpgrade";
import * as heroMetaInfoSchema from "./schemas/heroes/heroMetaInfo";
import * as heroRoleSchema from "./schemas/heroes/heroRole";
import * as heroTalentSchema from "./schemas/heroes/heroTalent";
import * as itemSchema from "./schemas/items/item";
import * as itemAbilitySchema from "./schemas/items/itemAbility";
import * as itemComponentSchema from "./schemas/items/itemComponent";
import * as itemMetaInfoSchema from "./schemas/items/itemMetaInfo";
import * as itemMetaInfoPercentageSchema from "./schemas/items/itemMetaInfoPercentage";
import * as itemPriceSchema from "./schemas/items/itemPrice";
import * as itemStatSchema from "./schemas/items/itemStat";

const URI = process.env.DB_URI ?? "";

const schema = {
  ...heroSchema,
  ...heroAbilitySchema,
  ...heroAbilityUpgradeSchema,
  ...heroMetaInfoSchema,
  ...heroRoleSchema,
  ...heroTalentSchema,
  ...itemSchema,
  ...itemAbilitySchema,
  ...itemComponentSchema,
  ...itemMetaInfoSchema,
  ...itemMetaInfoPercentageSchema,
  ...itemPriceSchema,
  ...itemStatSchema,
};

export const client = postgres(URI, { prepare: false });

export const db = drizzle(client, { schema });
