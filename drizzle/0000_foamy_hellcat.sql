DO $$ BEGIN
 CREATE TYPE "hero_ability_upgrade_type" AS ENUM('Aghanim Shard', 'Aghanim Scepter');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "hero_meta_info_rank" AS ENUM('Herald_Guardian_Crusader', 'Archon', 'Legend', 'Ancient', 'Divine_Immortal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "hero_meta_info_type" AS ENUM('Pick_Percentage', 'Win_Percentage');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "hero_primary_attribute" AS ENUM('Strength', 'Agility', 'Intelligence', 'Universal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "hero_role_type" AS ENUM('Carry', 'Support', 'Nuker', 'Disabler', 'Durable', 'Escape', 'Pusher', 'Initiator');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "hero_talent_level" AS ENUM('Novice', 'Intermediate', 'Advanced', 'Expert');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "item_classification" AS ENUM('Consumables', 'Attributes', 'Equipment', 'Miscellaneous', 'Secret', 'Accessories', 'Support', 'Magical', 'Armor', 'Weapons', 'Artifacts', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "item_meta_info_type" AS ENUM('Use_Percentage', 'Win_Percentage');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "item_price_type" AS ENUM('Purchase', 'Sell');
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
CREATE TABLE IF NOT EXISTS "hero" (
	"id" serial NOT NULL,
	"name" text PRIMARY KEY NOT NULL,
	"biography" text NOT NULL,
	"identity" text NOT NULL,
	"description" text NOT NULL,
	"primary_attribute" "hero_primary_attribute" NOT NULL,
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
CREATE TABLE IF NOT EXISTS "hero_ability_upgrade" (
	"id" serial NOT NULL,
	"ability_id" integer NOT NULL,
	"type" "hero_ability_upgrade_type" NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT hero_ability_upgrade_ability_id_type PRIMARY KEY("ability_id","type"),
	CONSTRAINT "hero_ability_upgrade_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_meta_info" (
	"id" serial NOT NULL,
	"hero_id" integer NOT NULL,
	"type" "hero_meta_info_type" NOT NULL,
	"rank" "hero_meta_info_rank" NOT NULL,
	"percentage" numeric(4, 2) NOT NULL,
	CONSTRAINT hero_meta_info_hero_id_type_rank PRIMARY KEY("hero_id","type","rank"),
	CONSTRAINT "hero_meta_info_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_role" (
	"id" serial NOT NULL,
	"hero_id" integer NOT NULL,
	"type" "hero_role_type" NOT NULL,
	CONSTRAINT hero_role_hero_id_type PRIMARY KEY("hero_id","type"),
	CONSTRAINT "hero_role_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_talent" (
	"id" serial NOT NULL,
	"hero_id" integer NOT NULL,
	"level" "hero_talent_level" NOT NULL,
	"type" text NOT NULL,
	"effect" text NOT NULL,
	CONSTRAINT hero_talent_hero_id_level_type PRIMARY KEY("hero_id","level","type"),
	CONSTRAINT "hero_talent_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item" (
	"id" serial NOT NULL,
	"name" text PRIMARY KEY NOT NULL,
	"lore" text NOT NULL,
	"type" "item_type" NOT NULL,
	"classification" "item_classification" NOT NULL,
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
CREATE TABLE IF NOT EXISTS "item_meta_info" (
	"id" serial NOT NULL,
	"item_id" integer PRIMARY KEY NOT NULL,
	"uses" integer NOT NULL,
	CONSTRAINT "item_meta_info_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_meta_info_percentage" (
	"id" serial NOT NULL,
	"item_meta_info_id" integer NOT NULL,
	"type" "item_meta_info_type" NOT NULL,
	"percentage" numeric(4, 2),
	CONSTRAINT item_meta_info_percentage_item_meta_info_id_type PRIMARY KEY("item_meta_info_id","type"),
	CONSTRAINT "item_meta_info_percentage_id_unique" UNIQUE("id")
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
	"type" "item_price_type" NOT NULL,
	"amount" text NOT NULL,
	CONSTRAINT item_price_item_id_type PRIMARY KEY("item_id","type"),
	CONSTRAINT "item_price_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_ability" ADD CONSTRAINT "hero_ability_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "hero"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_ability_upgrade" ADD CONSTRAINT "hero_ability_upgrade_ability_id_hero_ability_id_fk" FOREIGN KEY ("ability_id") REFERENCES "hero_ability"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_meta_info" ADD CONSTRAINT "hero_meta_info_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "hero"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "hero_talent" ADD CONSTRAINT "hero_talent_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "hero"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "item_component" ADD CONSTRAINT "item_component_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_meta_info" ADD CONSTRAINT "item_meta_info_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_meta_info_percentage" ADD CONSTRAINT "item_meta_info_percentage_item_meta_info_id_item_meta_info_id_fk" FOREIGN KEY ("item_meta_info_id") REFERENCES "item_meta_info"("id") ON DELETE no action ON UPDATE no action;
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
