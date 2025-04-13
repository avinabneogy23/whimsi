import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertMoodSchema, 
  insertFavoriteSchema,
  type User
} from "@shared/schema";
import { z } from "zod";

// For session handling
declare module "express-session" {
  interface SessionData {
    userId: number;
    username: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // For simplicity, we'll use a userId in session
    // In a real app, you'd want proper JWT auth
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // USER ROUTES
  
  // Register
  app.post("/api/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(parsed.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(parsed);
      
      // Set user session
      req.session.userId = newUser.id;
      req.session.username = newUser.username;
      
      return res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        firstName: newUser.firstName,
        currentStreak: newUser.currentStreak,
        preferences: newUser.preferences
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Login
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user session
      req.session.userId = user.id;
      req.session.username = user.username;
      
      return res.status(200).json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        currentStreak: user.currentStreak,
        preferences: user.preferences
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Logout
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
  
  // Get current user
  app.get("/api/user", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.status(200).json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        currentStreak: user.currentStreak,
        preferences: user.preferences
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update user preferences
  app.patch("/api/user/preferences", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const preferences = req.body;
      
      const updatedUser = await storage.updateUserPreferences(userId, preferences);
      
      return res.status(200).json({
        id: updatedUser.id,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        currentStreak: updatedUser.currentStreak,
        preferences: updatedUser.preferences
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update user streak
  app.patch("/api/user/streak", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const { streak } = req.body;
      
      if (typeof streak !== 'number') {
        return res.status(400).json({ message: "Streak must be a number" });
      }
      
      const updatedUser = await storage.updateUserStreak(userId, streak);
      
      return res.status(200).json({
        id: updatedUser.id,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        currentStreak: updatedUser.currentStreak,
        preferences: updatedUser.preferences
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // AFFIRMATION ROUTES
  
  // Get daily affirmation
  app.get("/api/affirmations/daily", async (req, res) => {
    try {
      const dailyAffirmation = await storage.getDailyAffirmation();
      
      // Add favorite status if user is logged in
      let isFavorite = false;
      if (req.session.userId) {
        isFavorite = await storage.isFavorite(req.session.userId, dailyAffirmation.id);
      }
      
      return res.status(200).json({
        ...dailyAffirmation,
        isFavorite
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all affirmations
  app.get("/api/affirmations", async (req, res) => {
    try {
      const affirmations = await storage.getAllAffirmations();
      return res.status(200).json(affirmations);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get affirmations by category
  app.get("/api/affirmations/category/:categoryName", async (req, res) => {
    try {
      const { categoryName } = req.params;
      const affirmations = await storage.getAffirmationsByCategory(categoryName);
      return res.status(200).json(affirmations);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // CATEGORY ROUTES
  
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // MOOD ROUTES
  
  // Record mood
  app.post("/api/moods", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const parsed = insertMoodSchema.parse({ ...req.body, userId });
      
      // Check if user already recorded mood today
      const todaysMood = await storage.getTodaysMood(userId);
      if (todaysMood) {
        return res.status(400).json({ message: "You have already recorded your mood today" });
      }
      
      const newMood = await storage.createMood(parsed);
      return res.status(201).json(newMood);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get today's mood
  app.get("/api/moods/today", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const todaysMood = await storage.getTodaysMood(userId);
      
      if (!todaysMood) {
        return res.status(404).json({ message: "No mood recorded for today" });
      }
      
      return res.status(200).json(todaysMood);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all moods for user
  app.get("/api/moods", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const moods = await storage.getMoodsByUserId(userId);
      return res.status(200).json(moods);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // FAVORITE ROUTES
  
  // Add favorite
  app.post("/api/favorites", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const parsed = insertFavoriteSchema.parse({ ...req.body, userId });
      
      const newFavorite = await storage.addFavorite(parsed);
      const affirmation = await storage.getAffirmation(newFavorite.affirmationId);
      
      return res.status(201).json({
        favorite: newFavorite,
        affirmation
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Remove favorite
  app.delete("/api/favorites/:affirmationId", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const affirmationId = parseInt(req.params.affirmationId);
      
      if (isNaN(affirmationId)) {
        return res.status(400).json({ message: "Invalid affirmation ID" });
      }
      
      await storage.removeFavorite(userId, affirmationId);
      return res.status(200).json({ message: "Favorite removed successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all favorites for user
  app.get("/api/favorites", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const favorites = await storage.getFavoritesByUserId(userId);
      return res.status(200).json(favorites);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
