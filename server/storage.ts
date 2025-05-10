import { 
  users, type User, type InsertUser,
  monitoredKeywords, type MonitoredKeyword, type InsertMonitoredKeyword,
  alerts, type Alert, type InsertAlert,
  threatStats, type ThreatStats, type InsertThreatStats,
  threatCategories, type ThreatCategory, type InsertThreatCategory
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Monitored Keywords operations
  getMonitoredKeywords(): Promise<MonitoredKeyword[]>;
  getMonitoredKeywordsByUserId(userId: number): Promise<MonitoredKeyword[]>;
  createMonitoredKeyword(keyword: InsertMonitoredKeyword): Promise<MonitoredKeyword>;
  deleteMonitoredKeyword(id: number): Promise<boolean>;

  // Alerts operations
  getAlerts(): Promise<Alert[]>;
  getAlert(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: number): Promise<boolean>;

  // Threat Stats operations
  getThreatStats(): Promise<ThreatStats | undefined>;
  updateThreatStats(stats: InsertThreatStats): Promise<ThreatStats>;

  // Threat Categories operations
  getThreatCategories(): Promise<ThreatCategory[]>;
  createThreatCategory(category: InsertThreatCategory): Promise<ThreatCategory>;

  // Initialize database with test data if needed
  initializeData(): Promise<void>;
}

// Database implementation of storage
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Monitored Keywords operations
  async getMonitoredKeywords(): Promise<MonitoredKeyword[]> {
    return await db.select().from(monitoredKeywords);
  }

  async getMonitoredKeywordsByUserId(userId: number): Promise<MonitoredKeyword[]> {
    return await db.select().from(monitoredKeywords).where(eq(monitoredKeywords.userId, userId));
  }

  async createMonitoredKeyword(insertKeyword: InsertMonitoredKeyword): Promise<MonitoredKeyword> {
    const [keyword] = await db.insert(monitoredKeywords).values(insertKeyword).returning();
    return keyword;
  }

  async deleteMonitoredKeyword(id: number): Promise<boolean> {
    const result = await db.delete(monitoredKeywords).where(eq(monitoredKeywords.id, id)).returning();
    return result.length > 0;
  }

  // Alerts operations
  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(alerts.createdAt);
  }

  async getAlert(id: number): Promise<Alert | undefined> {
    const [alert] = await db.select().from(alerts).where(eq(alerts.id, id));
    return alert;
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const [alert] = await db.insert(alerts)
      .values({ ...insertAlert, isRead: false })
      .returning();
    return alert;
  }

  async markAlertAsRead(id: number): Promise<boolean> {
    const result = await db.update(alerts)
      .set({ isRead: true })
      .where(eq(alerts.id, id))
      .returning();
    return result.length > 0;
  }

  // Threat Stats operations
  async getThreatStats(): Promise<ThreatStats | undefined> {
    const [stats] = await db.select().from(threatStats);
    return stats;
  }

  async updateThreatStats(insertStats: InsertThreatStats): Promise<ThreatStats> {
    const existingStats = await this.getThreatStats();
    
    if (existingStats) {
      const [updatedStats] = await db.update(threatStats)
        .set({ ...insertStats, lastUpdated: new Date() })
        .where(eq(threatStats.id, existingStats.id))
        .returning();
      return updatedStats;
    } else {
      const [newStats] = await db.insert(threatStats)
        .values({ ...insertStats, lastUpdated: new Date() })
        .returning();
      return newStats;
    }
  }

  // Threat Categories operations
  async getThreatCategories(): Promise<ThreatCategory[]> {
    return await db.select().from(threatCategories);
  }

  async createThreatCategory(insertCategory: InsertThreatCategory): Promise<ThreatCategory> {
    const [category] = await db.insert(threatCategories)
      .values(insertCategory)
      .returning();
    return category;
  }

  // Initialize sample data for the application
  async initializeData(): Promise<void> {
    // Check if we already have data
    const userCount = await db.select({ count: users.id }).from(users);
    if (userCount.length > 0 && userCount[0].count) {
      console.log("Database already has data, skipping initialization");
      return;
    }

    console.log("Initializing database with sample data");
    
    // Create default user
    const [user] = await db.insert(users).values({
      username: "analyst",
      password: "password",
      role: "analyst"
    }).returning();

    // Create sample monitored keywords
    const keywords = [
      { keyword: "cybercrime", status: "active", frequency: "24h", userId: user.id },
      { keyword: "data breach", status: "active", frequency: "12h", userId: user.id },
      { keyword: "credit cards", status: "active", frequency: "7d", userId: user.id },
      { keyword: "company name", status: "active", frequency: "3d", userId: user.id }
    ];
    
    for (const keyword of keywords) {
      await db.insert(monitoredKeywords).values(keyword);
    }

    // Create sample alerts
    const sampleAlerts = [
      {
        title: "Credentials Leaked",
        description: "12 employee credentials found in new data breach dump on dark forum.",
        type: "credentials",
        riskLevel: "high"
      },
      {
        title: "Company Mention",
        description: "Your company was mentioned in a threat actor discussion about potential targets.",
        type: "mention",
        riskLevel: "medium"
      },
      {
        title: "Database for Sale",
        description: "A database allegedly containing customer data is being offered for sale on a marketplace.",
        type: "database",
        riskLevel: "critical"
      },
      {
        title: "Executive Mentioned",
        description: "An executive's name was mentioned in a dark forum related to potential phishing campaigns.",
        type: "executive",
        riskLevel: "medium"
      },
      {
        title: "New Intelligence",
        description: "New threat intelligence report available about emerging ransomware groups targeting your industry.",
        type: "intelligence",
        riskLevel: "info"
      }
    ];
    
    for (const alert of sampleAlerts) {
      await db.insert(alerts).values({ ...alert, isRead: false });
    }

    // Create threat stats
    await db.insert(threatStats).values({
      activeThreats: 37,
      dataLeaks: 12,
      credentialsFound: 128,
      monitoredKeywords: 24,
      weeklyChange: {
        activeThreats: 12,
        dataLeaks: 3,
        credentialsFound: 28,
        monitoredKeywords: 0
      },
      lastUpdated: new Date()
    });

    // Create threat categories
    const categories = [
      { category: "Data Breaches", percentage: 38, growth: 5, color: "hsl(0, 84.2%, 60.2%)" },
      { category: "Phishing", percentage: 26, growth: 2, color: "hsl(45, 100%, 51%)" },
      { category: "Malware", percentage: 18, growth: -3, color: "hsl(207, 90%, 54%)" },
      { category: "Ransomware", percentage: 12, growth: 34, color: "hsl(151, 100%, 50%)" },
      { category: "Social Engineering", percentage: 4, growth: 10, color: "hsl(280, 100%, 60%)" },
      { category: "Other", percentage: 2, growth: 0, color: "hsl(0, 0%, 75%)" }
    ];
    
    for (const category of categories) {
      await db.insert(threatCategories).values(category);
    }
    
    console.log("Database initialized successfully");
  }
}

export const storage = new DatabaseStorage();
