import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  pay: text("pay").notNull(),
  description: text("description").notNull(),
  applyUrl: text("apply_url").notNull(),
  responsibilities: jsonb("responsibilities").$type<string[]>().notNull().default([]),
  qualifications: jsonb("qualifications").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobAnalytics = pgTable("job_analytics", {
  id: serial("id").primaryKey(),
  jobId: text("job_id").notNull().unique(),
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  applyClicks: integer("apply_clicks").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});
