ALTER TABLE "learning_plan_table" RENAME TO "learning_plans_table";--> statement-breakpoint
ALTER TABLE "learning_plans_table" DROP CONSTRAINT "learning_plan_table_user_id_users_table_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "learning_plans_table" ADD CONSTRAINT "learning_plans_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
