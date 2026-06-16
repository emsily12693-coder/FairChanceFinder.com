CREATE TABLE IF NOT EXISTS "job_analytics" (
	"id" serial PRIMARY KEY,
	"job_id" text NOT NULL UNIQUE,
	"impressions" integer DEFAULT 0 NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"apply_clicks" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"location" text NOT NULL,
	"type" text NOT NULL,
	"pay" text NOT NULL,
	"description" text NOT NULL,
	"apply_url" text NOT NULL,
	"responsibilities" jsonb DEFAULT '[]' NOT NULL,
	"qualifications" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
