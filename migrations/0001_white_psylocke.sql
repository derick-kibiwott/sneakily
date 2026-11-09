ALTER TABLE "user" RENAME COLUMN "name" TO "username";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");