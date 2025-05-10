import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("analyst"),
});

export const monitoredKeywords = pgTable("monitored_keywords", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  userId: integer("user_id").references(() => users.id),
  status: text("status").default("active"),
  frequency: text("frequency").default("24h"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // credentials, mention, database, executive, intelligence
  riskLevel: text("risk_level").notNull(), // critical, high, medium, low, info
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false),
});

export const threatStats = pgTable("threat_stats", {
  id: serial("id").primaryKey(),
  activeThreats: integer("active_threats").default(0),
  dataLeaks: integer("data_leaks").default(0),
  credentialsFound: integer("credentials_found").default(0),
  monitoredKeywords: integer("monitored_keywords").default(0),
  weeklyChange: json("weekly_change"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const threatCategories = pgTable("threat_categories", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  percentage: integer("percentage").notNull(),
  growth: integer("growth").default(0),
  color: text("color").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertMonitoredKeywordSchema = createInsertSchema(monitoredKeywords).pick({
  keyword: true,
  userId: true,
  status: true,
  frequency: true,
});

export const insertAlertSchema = createInsertSchema(alerts).pick({
  title: true,
  description: true,
  type: true,
  riskLevel: true,
});

export const insertThreatStatsSchema = createInsertSchema(threatStats).pick({
  activeThreats: true,
  dataLeaks: true,
  credentialsFound: true,
  monitoredKeywords: true,
  weeklyChange: true,
});

export const insertThreatCategoriesSchema = createInsertSchema(threatCategories).pick({
  category: true,
  percentage: true,
  growth: true,
  color: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMonitoredKeyword = z.infer<typeof insertMonitoredKeywordSchema>;
export type MonitoredKeyword = typeof monitoredKeywords.$inferSelect;

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export type InsertThreatStats = z.infer<typeof insertThreatStatsSchema>;
export type ThreatStats = typeof threatStats.$inferSelect;

export type InsertThreatCategory = z.infer<typeof insertThreatCategoriesSchema>;
export type ThreatCategory = typeof threatCategories.$inferSelect;
