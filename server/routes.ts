import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMonitoredKeywordSchema, insertAlertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Base API routes prefix
  const apiPrefix = "/api";

  // Get monitored keywords
  app.get(`${apiPrefix}/keywords`, async (req: Request, res: Response) => {
    try {
      const keywords = await storage.getMonitoredKeywords();
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch monitored keywords" });
    }
  });

  // Create a new monitored keyword
  app.post(`${apiPrefix}/keywords`, async (req: Request, res: Response) => {
    try {
      const parseResult = insertMonitoredKeywordSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid keyword data", errors: parseResult.error });
      }
      
      const newKeyword = await storage.createMonitoredKeyword(parseResult.data);
      res.status(201).json(newKeyword);
    } catch (error) {
      res.status(500).json({ message: "Failed to create monitored keyword" });
    }
  });

  // Delete a monitored keyword
  app.delete(`${apiPrefix}/keywords/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid keyword ID" });
      }
      
      const success = await storage.deleteMonitoredKeyword(id);
      if (success) {
        res.json({ message: "Keyword deleted successfully" });
      } else {
        res.status(404).json({ message: "Keyword not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete monitored keyword" });
    }
  });

  // Get all alerts
  app.get(`${apiPrefix}/alerts`, async (req: Request, res: Response) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  // Get a specific alert
  app.get(`${apiPrefix}/alerts/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid alert ID" });
      }
      
      const alert = await storage.getAlert(id);
      if (alert) {
        res.json(alert);
      } else {
        res.status(404).json({ message: "Alert not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alert" });
    }
  });

  // Create a new alert
  app.post(`${apiPrefix}/alerts`, async (req: Request, res: Response) => {
    try {
      const parseResult = insertAlertSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid alert data", errors: parseResult.error });
      }
      
      const newAlert = await storage.createAlert(parseResult.data);
      res.status(201).json(newAlert);
    } catch (error) {
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  // Mark an alert as read
  app.patch(`${apiPrefix}/alerts/:id/read`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid alert ID" });
      }
      
      const success = await storage.markAlertAsRead(id);
      if (success) {
        res.json({ message: "Alert marked as read" });
      } else {
        res.status(404).json({ message: "Alert not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  // Get threat stats
  app.get(`${apiPrefix}/stats`, async (req: Request, res: Response) => {
    try {
      const stats = await storage.getThreatStats();
      res.json(stats || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch threat stats" });
    }
  });

  // Get threat categories
  app.get(`${apiPrefix}/categories`, async (req: Request, res: Response) => {
    try {
      const categories = await storage.getThreatCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch threat categories" });
    }
  });

  // Search the "dark web" (mock)
  app.post(`${apiPrefix}/search`, async (req: Request, res: Response) => {
    try {
      const { query, networks, contentType, timeRange, riskLevel } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      // Simulating search results
      // In a real app, this would connect to a dark web scanning service
      res.json({
        query,
        results: [],
        message: "Search functionality implemented. Connect to a real dark web scanning service for actual results."
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to perform search" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
