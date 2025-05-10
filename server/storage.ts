import { 
  users, type User, type InsertUser,
  monitoredKeywords, type MonitoredKeyword, type InsertMonitoredKeyword,
  alerts, type Alert, type InsertAlert,
  threatStats, type ThreatStats, type InsertThreatStats,
  threatCategories, type ThreatCategory, type InsertThreatCategory
} from "@shared/schema";

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
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private monitoredKeywords: Map<number, MonitoredKeyword>;
  private alerts: Map<number, Alert>;
  private threatStats: ThreatStats | undefined;
  private threatCategories: Map<number, ThreatCategory>;
  
  private currentUserId: number;
  private currentKeywordId: number;
  private currentAlertId: number;
  private currentThreatCategoryId: number;

  constructor() {
    this.users = new Map();
    this.monitoredKeywords = new Map();
    this.alerts = new Map();
    this.threatCategories = new Map();
    
    this.currentUserId = 1;
    this.currentKeywordId = 1;
    this.currentAlertId = 1;
    this.currentThreatCategoryId = 1;
    
    // Initialize with some demo data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Monitored Keywords operations
  async getMonitoredKeywords(): Promise<MonitoredKeyword[]> {
    return Array.from(this.monitoredKeywords.values());
  }

  async getMonitoredKeywordsByUserId(userId: number): Promise<MonitoredKeyword[]> {
    return Array.from(this.monitoredKeywords.values()).filter(
      (keyword) => keyword.userId === userId,
    );
  }

  async createMonitoredKeyword(insertKeyword: InsertMonitoredKeyword): Promise<MonitoredKeyword> {
    const id = this.currentKeywordId++;
    const createdAt = new Date();
    const keyword: MonitoredKeyword = { ...insertKeyword, id, createdAt };
    this.monitoredKeywords.set(id, keyword);
    return keyword;
  }

  async deleteMonitoredKeyword(id: number): Promise<boolean> {
    return this.monitoredKeywords.delete(id);
  }

  // Alerts operations
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.currentAlertId++;
    const createdAt = new Date();
    const alert: Alert = { ...insertAlert, id, createdAt, isRead: false };
    this.alerts.set(id, alert);
    return alert;
  }

  async markAlertAsRead(id: number): Promise<boolean> {
    const alert = this.alerts.get(id);
    if (!alert) return false;
    
    alert.isRead = true;
    this.alerts.set(id, alert);
    return true;
  }

  // Threat Stats operations
  async getThreatStats(): Promise<ThreatStats | undefined> {
    return this.threatStats;
  }

  async updateThreatStats(insertStats: InsertThreatStats): Promise<ThreatStats> {
    const lastUpdated = new Date();
    
    if (this.threatStats) {
      this.threatStats = { ...this.threatStats, ...insertStats, lastUpdated };
    } else {
      this.threatStats = { ...insertStats, id: 1, lastUpdated };
    }
    
    return this.threatStats;
  }

  // Threat Categories operations
  async getThreatCategories(): Promise<ThreatCategory[]> {
    return Array.from(this.threatCategories.values());
  }

  async createThreatCategory(insertCategory: InsertThreatCategory): Promise<ThreatCategory> {
    const id = this.currentThreatCategoryId++;
    const category: ThreatCategory = { ...insertCategory, id };
    this.threatCategories.set(id, category);
    return category;
  }

  // Initialize sample data for the application
  private async initializeData() {
    // Create default user
    await this.createUser({
      username: "analyst",
      password: "password",
      role: "analyst"
    });

    // Create sample monitored keywords
    const keywords = [
      { keyword: "cybercrime", status: "active", frequency: "24h", userId: 1 },
      { keyword: "data breach", status: "active", frequency: "12h", userId: 1 },
      { keyword: "credit cards", status: "active", frequency: "7d", userId: 1 },
      { keyword: "company name", status: "active", frequency: "3d", userId: 1 }
    ];
    
    for (const keyword of keywords) {
      await this.createMonitoredKeyword(keyword);
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
      await this.createAlert(alert);
    }

    // Create threat stats
    await this.updateThreatStats({
      activeThreats: 37,
      dataLeaks: 12,
      credentialsFound: 128,
      monitoredKeywords: 24,
      weeklyChange: {
        activeThreats: 12,
        dataLeaks: 3,
        credentialsFound: 28,
        monitoredKeywords: 0
      }
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
      await this.createThreatCategory(category);
    }
  }
}

export const storage = new MemStorage();
