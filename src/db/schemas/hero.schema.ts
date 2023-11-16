import { serial, text, pgTable } from "drizzle-orm/pg-core"

export const hero = pgTable("hero", {
  id: serial("id"),
  name: text("name"),
  bio: text("bio"),
  identity: text("identity"),
  description: text("description"),
  primary_attribute: text("primary_attribute"),
})
