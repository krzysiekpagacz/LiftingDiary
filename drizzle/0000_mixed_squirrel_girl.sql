CREATE TABLE "exercise_catalog" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"muscle_group" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "exercise_catalog_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"workout_exercise_id" integer NOT NULL,
	"set_number" integer NOT NULL,
	"reps" integer,
	"weight_kg" numeric(6, 2),
	"rpe" numeric(3, 1),
	"duration_seconds" integer,
	"is_warmup" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"workout_id" integer NOT NULL,
	"exercise_id" integer NOT NULL,
	"order" integer NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text,
	"date" timestamp DEFAULT now() NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sets" ADD CONSTRAINT "sets_workout_exercise_id_workout_exercises_id_fk" FOREIGN KEY ("workout_exercise_id") REFERENCES "public"."workout_exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exercise_id_exercise_catalog_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise_catalog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workouts_user_id_idx" ON "workouts" USING btree ("user_id");