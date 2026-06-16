CREATE TABLE IF NOT EXISTS "applications" (
  "id" serial PRIMARY KEY NOT NULL,
  "job_id" text NOT NULL,
  "applicant_name" text NOT NULL,
  "applicant_email" text NOT NULL,
  "resume_key" text,
  "created_at" timestamp DEFAULT now()
);
