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
CREATE TABLE IF NOT EXISTS "hero" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"biography" text NOT NULL,
	"identity" text NOT NULL,
	"description" text NOT NULL,
	"primary_attribute" "primary_attribute" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_ability" (
	"id" serial PRIMARY KEY NOT NULL,
	"hero_id" integer NOT NULL,
	"name" text NOT NULL,
	"lore" text,
	"description" text NOT NULL,
	"ability_type" text NOT NULL,
	"damage_type" text,
	"affected_target" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_role" (
	"hero_id" integer NOT NULL,
	"role_type" "role_type" NOT NULL,
	CONSTRAINT hero_role_hero_id_role_type PRIMARY KEY("hero_id","role_type")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "talent" (
	"id" serial PRIMARY KEY NOT NULL,
	"hero_id" integer NOT NULL,
	"talent_level" "talent_level" NOT NULL,
	"left_route" text NOT NULL,
	"right_route" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "upgrade" (
	"id" serial PRIMARY KEY NOT NULL,
	"ability_id" integer NOT NULL,
	"description" text NOT NULL,
	"upgrade_type" "upgrade_type" NOT NULL
);
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
 ALTER TABLE "talent" ADD CONSTRAINT "talent_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "hero"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "upgrade" ADD CONSTRAINT "upgrade_ability_id_hero_ability_id_fk" FOREIGN KEY ("ability_id") REFERENCES "hero_ability"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
