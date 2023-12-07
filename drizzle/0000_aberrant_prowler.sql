DO $$ BEGIN
 CREATE TYPE "primary_attribute" AS ENUM('Strength', 'Agility', 'Intelligence', 'Universal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero" (
	"id" serial NOT NULL,
	"name" text,
	"bio" text,
	"identity" text,
	"description" text,
	"primary_attribute" "primary_attribute"
);
