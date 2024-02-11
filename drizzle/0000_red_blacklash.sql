DO $$ BEGIN
 CREATE TYPE "hero_attack_type" AS ENUM('Melee', 'Ranged');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "hero_complexity" AS ENUM('Simple', 'Moderate', 'Complex');
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
 CREATE TYPE "hero_ability_upgrade_type" AS ENUM('Shard Upgrade', 'Scepter Upgrade');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "hero_meta_info_rank" AS ENUM('Herald / Guardian / Crusader', 'Archon', 'Legend', 'Ancient', 'Divine / Immortal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "hero_meta_info_type" AS ENUM('Pick Percentage', 'Win Percentage');
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
 CREATE TYPE "item_type" AS ENUM('Basic', 'Upgrade', 'Neutral');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "item_meta_info_type" AS ENUM('Use Percentage', 'Win Percentage');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "item_price_type" AS ENUM('Purchase Price', 'Sell Price');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero" (
	"id" serial NOT NULL,
	"name" text PRIMARY KEY NOT NULL,
	"alias" text,
	"biography" text NOT NULL,
	"identity" text NOT NULL,
	"description" text NOT NULL,
	"complexity" "hero_complexity" NOT NULL,
	"attack_type" "hero_attack_type" NOT NULL,
	"primary_attribute" "hero_primary_attribute" NOT NULL,
	"primary_image_key" text,
	"secondary_image_key" text,
	CONSTRAINT "hero_id_unique" UNIQUE("id"),
	CONSTRAINT "hero_alias_unique" UNIQUE("alias"),
	CONSTRAINT "hero_primary_image_key_unique" UNIQUE("primary_image_key"),
	CONSTRAINT "hero_secondary_image_key_unique" UNIQUE("secondary_image_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_ability" (
	"id" serial NOT NULL,
	"hero_id" integer NOT NULL,
	"name" text NOT NULL,
	"lore" text,
	"description" text NOT NULL,
	"ability_type" text NOT NULL,
	"affected_target" text,
	"damage_type" text,
	"has_shard_upgrade" boolean NOT NULL,
	"has_scepter_upgrade" boolean NOT NULL,
	"image_key" text,
	CONSTRAINT "hero_ability_hero_id_name_pk" PRIMARY KEY("hero_id","name"),
	CONSTRAINT "hero_ability_id_unique" UNIQUE("id"),
	CONSTRAINT "hero_ability_image_key_unique" UNIQUE("image_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_ability_upgrade" (
	"id" serial NOT NULL,
	"ability_id" integer NOT NULL,
	"type" "hero_ability_upgrade_type" NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "hero_ability_upgrade_ability_id_type_pk" PRIMARY KEY("ability_id","type"),
	CONSTRAINT "hero_ability_upgrade_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_meta_info" (
	"id" serial NOT NULL,
	"hero_id" integer NOT NULL,
	"rank" "hero_meta_info_rank" NOT NULL,
	"type" "hero_meta_info_type" NOT NULL,
	"percentage" numeric(4, 2) NOT NULL,
	CONSTRAINT "hero_meta_info_hero_id_rank_type_pk" PRIMARY KEY("hero_id","rank","type"),
	CONSTRAINT "hero_meta_info_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_role" (
	"id" serial NOT NULL,
	"hero_id" integer NOT NULL,
	"type" "hero_role_type" NOT NULL,
	CONSTRAINT "hero_role_hero_id_type_pk" PRIMARY KEY("hero_id","type"),
	CONSTRAINT "hero_role_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_talent" (
	"id" serial NOT NULL,
	"hero_id" integer NOT NULL,
	"level" "hero_talent_level" NOT NULL,
	"type" text NOT NULL,
	"effect" text NOT NULL,
	CONSTRAINT "hero_talent_hero_id_level_type_pk" PRIMARY KEY("hero_id","level","type"),
	CONSTRAINT "hero_talent_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item" (
	"id" serial NOT NULL,
	"name" text PRIMARY KEY NOT NULL,
	"lore" text,
	"type" "item_type" NOT NULL,
	"classification" "item_classification" NOT NULL,
	"has_stats" boolean NOT NULL,
	"has_abilities" boolean NOT NULL,
	"has_prices" boolean NOT NULL,
	"has_components" boolean NOT NULL,
	"image_key" text,
	CONSTRAINT "item_id_unique" UNIQUE("id"),
	CONSTRAINT "item_image_key_unique" UNIQUE("image_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_ability" (
	"id" serial NOT NULL,
	"item_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"ability_type" text NOT NULL,
	"affected_target" text,
	"damage_type" text,
	CONSTRAINT "item_ability_item_id_name_pk" PRIMARY KEY("item_id","name"),
	CONSTRAINT "item_ability_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_component" (
	"id" serial NOT NULL,
	"item_id" integer NOT NULL,
	"name" text NOT NULL,
	"amount" text NOT NULL,
	"price" text NOT NULL,
	CONSTRAINT "item_component_item_id_name_pk" PRIMARY KEY("item_id","name"),
	CONSTRAINT "item_component_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_meta_info" (
	"id" serial NOT NULL,
	"item_id" integer PRIMARY KEY NOT NULL,
	"uses" text NOT NULL,
	CONSTRAINT "item_meta_info_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_meta_info_percentage" (
	"id" serial NOT NULL,
	"item_meta_info_id" integer NOT NULL,
	"type" "item_meta_info_type" NOT NULL,
	"percentage" numeric(4, 2),
	CONSTRAINT "item_meta_info_percentage_item_meta_info_id_type_pk" PRIMARY KEY("item_meta_info_id","type"),
	CONSTRAINT "item_meta_info_percentage_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_price" (
	"id" serial NOT NULL,
	"item_id" integer NOT NULL,
	"type" "item_price_type" NOT NULL,
	"amount" text NOT NULL,
	CONSTRAINT "item_price_item_id_type_pk" PRIMARY KEY("item_id","type"),
	CONSTRAINT "item_price_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_stat" (
	"id" serial NOT NULL,
	"item_id" integer NOT NULL,
	"effect" text NOT NULL,
	CONSTRAINT "item_stat_item_id_effect_pk" PRIMARY KEY("item_id","effect"),
	CONSTRAINT "item_stat_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_ability" ADD CONSTRAINT "hero_ability_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_ability_upgrade" ADD CONSTRAINT "hero_ability_upgrade_ability_id_hero_ability_id_fk" FOREIGN KEY ("ability_id") REFERENCES "public"."hero_ability"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_meta_info" ADD CONSTRAINT "hero_meta_info_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_role" ADD CONSTRAINT "hero_role_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_talent" ADD CONSTRAINT "hero_talent_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_ability" ADD CONSTRAINT "item_ability_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_component" ADD CONSTRAINT "item_component_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_meta_info" ADD CONSTRAINT "item_meta_info_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_meta_info_percentage" ADD CONSTRAINT "item_meta_info_percentage_item_meta_info_id_item_meta_info_id_fk" FOREIGN KEY ("item_meta_info_id") REFERENCES "public"."item_meta_info"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_price" ADD CONSTRAINT "item_price_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_stat" ADD CONSTRAINT "item_stat_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
