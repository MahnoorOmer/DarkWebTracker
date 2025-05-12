import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export var users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    role: text("role").default("analyst"),
});
export var monitoredKeywords = pgTable("monitored_keywords", {
    id: serial("id").primaryKey(),
    keyword: text("keyword").notNull(),
    userId: integer("user_id").references(function () { return users.id; }),
    status: text("status").default("active"),
    frequency: text("frequency").default("24h"),
    createdAt: timestamp("created_at").defaultNow(),
});
export var alerts = pgTable("alerts", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    type: text("type").notNull(), // credentials, mention, database, executive, intelligence
    riskLevel: text("risk_level").notNull(), // critical, high, medium, low, info
    createdAt: timestamp("created_at").defaultNow(),
    isRead: boolean("is_read").default(false),
});
export var threatStats = pgTable("threat_stats", {
    id: serial("id").primaryKey(),
    activeThreats: integer("active_threats").default(0),
    dataLeaks: integer("data_leaks").default(0),
    credentialsFound: integer("credentials_found").default(0),
    monitoredKeywords: integer("monitored_keywords").default(0),
    weeklyChange: json("weekly_change"),
    lastUpdated: timestamp("last_updated").defaultNow(),
});
export var threatCategories = pgTable("threat_categories", {
    id: serial("id").primaryKey(),
    category: text("category").notNull(),
    percentage: integer("percentage").notNull(),
    growth: integer("growth").default(0),
    color: text("color").notNull(),
});
// Insert schemas
export var insertUserSchema = createInsertSchema(users).pick({
    username: true,
    password: true,
    role: true,
});
export var insertMonitoredKeywordSchema = createInsertSchema(monitoredKeywords).pick({
    keyword: true,
    userId: true,
    status: true,
    frequency: true,
});
export var insertAlertSchema = createInsertSchema(alerts).pick({
    title: true,
    description: true,
    type: true,
    riskLevel: true,
});
export var insertThreatStatsSchema = createInsertSchema(threatStats).pick({
    activeThreats: true,
    dataLeaks: true,
    credentialsFound: true,
    monitoredKeywords: true,
    weeklyChange: true,
});
export var insertThreatCategoriesSchema = createInsertSchema(threatCategories).pick({
    category: true,
    percentage: true,
    growth: true,
    color: true,
});
