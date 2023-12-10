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
CREATE TABLE IF NOT EXISTS "component" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"name" text NOT NULL,
	"amount" text NOT NULL,
	"price" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"lore" text,
	"item_type" "item_type" NOT NULL,
	"classification" "classification" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_ability" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"ability_type" text NOT NULL,
	"damage_type" text,
	"affected_target" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_stat" (
	"item_id" integer NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT item_stat_item_id_description PRIMARY KEY("item_id","description")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "price" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"price_type" "price_type" NOT NULL,
	"amount" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "component" ADD CONSTRAINT "component_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "price" ADD CONSTRAINT "price_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
