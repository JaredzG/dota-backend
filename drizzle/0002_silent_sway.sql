ALTER TABLE "hero_role" ADD COLUMN "id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "item_stat" ADD COLUMN "id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "hero_role" ADD CONSTRAINT "hero_role_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "item_stat" ADD CONSTRAINT "item_stat_id_unique" UNIQUE("id");