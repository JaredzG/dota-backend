DO $$ BEGIN
 CREATE TYPE "classification" AS ENUM('Consumables', 'Attributes', 'Equipment', 'Miscellaneous', 'Secret', 'Accessories', 'Support', 'Magical', 'Armor', 'Weapons', 'Artifacts', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "item_type" AS ENUM('Basic', 'Upgrade', 'Neutral');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "price_type" AS ENUM('Purchase', 'Sell');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "primary_attribute" AS ENUM('Strength', 'Agility', 'Intelligence', 'Universal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "role_type" AS ENUM('Carry', 'Support', 'Nuker', 'Disabler', 'Durable', 'Escape', 'Pusher', 'Initiator');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "talent_level" AS ENUM('Novice', 'Intermediate', 'Advanced', 'Expert');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "upgrade_type" AS ENUM('Aghanim Shard', 'Aghanim Scepter');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_component" (
	"id" serial NOT NULL,
	"item_id" integer NOT NULL,
	"name" text NOT NULL,
	"amount" text NOT NULL,
	"price" text NOT NULL,
	CONSTRAINT item_component_item_id_name PRIMARY KEY("item_id","name"),
	CONSTRAINT "item_component_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero" (
	"id" serial NOT NULL,
	"name" text PRIMARY KEY NOT NULL,
	"biography" text NOT NULL,
	"identity" text NOT NULL,
	"description" text NOT NULL,
	"primary_attribute" "primary_attribute" NOT NULL,
	CONSTRAINT "hero_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_ability" (
	"id" serial NOT NULL,
	"hero_id" integer NOT NULL,
	"name" text NOT NULL,
	"lore" text NOT NULL,
	"description" text NOT NULL,
	"ability_type" text NOT NULL,
	"damage_type" text NOT NULL,
	"affected_target" text NOT NULL,
	CONSTRAINT hero_ability_hero_id_name PRIMARY KEY("hero_id","name"),
	CONSTRAINT "hero_ability_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_role" (
	"id" serial NOT NULL,
	"hero_id" integer NOT NULL,
	"role_type" "role_type" NOT NULL,
	CONSTRAINT hero_role_hero_id_role_type PRIMARY KEY("hero_id","role_type"),
	CONSTRAINT "hero_role_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item" (
	"id" serial NOT NULL,
	"name" text PRIMARY KEY NOT NULL,
	"lore" text NOT NULL,
	"item_type" "item_type" NOT NULL,
	"classification" "classification" NOT NULL,
	CONSTRAINT "item_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_ability" (
	"id" serial NOT NULL,
	"item_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"ability_type" text NOT NULL,
	"damage_type" text NOT NULL,
	"affected_target" text NOT NULL,
	CONSTRAINT item_ability_item_id_name PRIMARY KEY("item_id","name"),
	CONSTRAINT "item_ability_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_stat" (
	"id" serial NOT NULL,
	"item_id" integer NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT item_stat_item_id_description PRIMARY KEY("item_id","description"),
	CONSTRAINT "item_stat_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_price" (
	"id" serial NOT NULL,
	"item_id" integer NOT NULL,
	"price_type" "price_type" NOT NULL,
	"amount" text NOT NULL,
	CONSTRAINT item_price_item_id_price_type PRIMARY KEY("item_id","price_type"),
	CONSTRAINT "item_price_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_talent" (
	"id" serial NOT NULL,
	"hero_id" integer NOT NULL,
	"talent_level" "talent_level" NOT NULL,
	"left_route" text NOT NULL,
	"right_route" text NOT NULL,
	CONSTRAINT hero_talent_hero_id_talent_level PRIMARY KEY("hero_id","talent_level"),
	CONSTRAINT "hero_talent_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_ability_upgrade" (
	"id" serial NOT NULL,
	"ability_id" integer NOT NULL,
	"upgrade_type" "upgrade_type" NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT hero_ability_upgrade_ability_id_upgrade_type PRIMARY KEY("ability_id","upgrade_type"),
	CONSTRAINT "hero_ability_upgrade_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_component" ADD CONSTRAINT "item_component_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_ability" ADD CONSTRAINT "hero_ability_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "hero"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_role" ADD CONSTRAINT "hero_role_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "hero"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_ability" ADD CONSTRAINT "item_ability_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_stat" ADD CONSTRAINT "item_stat_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_price" ADD CONSTRAINT "item_price_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_talent" ADD CONSTRAINT "hero_talent_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "hero"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_ability_upgrade" ADD CONSTRAINT "hero_ability_upgrade_ability_id_hero_ability_id_fk" FOREIGN KEY ("ability_id") REFERENCES "hero_ability"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
