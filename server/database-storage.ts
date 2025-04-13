import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "./db";
import { 
  users, type User, type InsertUser,
  affirmations, type Affirmation, type InsertAffirmation,
  categories, type Category, type InsertCategory,
  moods, type Mood, type InsertMood,
  favorites, type Favorite, type InsertFavorite
} from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const results = await db.insert(users).values(insertUser).returning();
    return results[0];
  }

  async updateUserStreak(userId: number, streak: number): Promise<User> {
    const results = await db
      .update(users)
      .set({ currentStreak: streak })
      .where(eq(users.id, userId))
      .returning();
    return results[0];
  }

  async updateUserPreferences(userId: number, preferences: any): Promise<User> {
    const results = await db
      .update(users)
      .set({ preferences })
      .where(eq(users.id, userId))
      .returning();
    return results[0];
  }

  // Affirmation operations
  async getAffirmation(id: number): Promise<Affirmation | undefined> {
    const results = await db.select().from(affirmations).where(eq(affirmations.id, id));
    return results[0];
  }

  async getAffirmationsByCategory(category: string): Promise<Affirmation[]> {
    return db.select().from(affirmations).where(eq(affirmations.category, category));
  }

  async getAllAffirmations(): Promise<Affirmation[]> {
    return db.select().from(affirmations);
  }

  async createAffirmation(insertAffirmation: InsertAffirmation): Promise<Affirmation> {
    const results = await db.insert(affirmations).values(insertAffirmation).returning();
    return results[0];
  }

  async getDailyAffirmation(): Promise<Affirmation> {
    // Get a random affirmation using SQL's random() function
    const results = await db
      .select()
      .from(affirmations)
      .orderBy(sql`random()`)
      .limit(1);
    
    if (results.length === 0) {
      // If no affirmations exist, create a default one
      return this.createAffirmation({
        text: "Today is a wonderful day full of possibilities!",
        category: "General",
        audioPath: null
      });
    }
    
    return results[0];
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const results = await db.select().from(categories).where(eq(categories.id, id));
    return results[0];
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    const results = await db.select().from(categories).where(eq(categories.name, name));
    return results[0];
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const results = await db.insert(categories).values(insertCategory).returning();
    return results[0];
  }

  // Mood operations
  async getMoodsByUserId(userId: number): Promise<Mood[]> {
    return db
      .select()
      .from(moods)
      .where(eq(moods.userId, userId))
      .orderBy(desc(moods.date));
  }

  async createMood(insertMood: InsertMood): Promise<Mood> {
    // Ensure mood has a date if not provided
    if (!insertMood.date) {
      insertMood.date = new Date();
    }

    const results = await db.insert(moods).values(insertMood).returning();
    return results[0];
  }

  async getTodaysMood(userId: number): Promise<Mood | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // SQL for finding moods between today and tomorrow (next day)
    const results = await db
      .select()
      .from(moods)
      .where(
        and(
          eq(moods.userId, userId),
          sql`${moods.date} >= ${today.toISOString()}`,
          sql`${moods.date} < ${tomorrow.toISOString()}`
        )
      )
      .orderBy(desc(moods.date))
      .limit(1);
    
    return results[0];
  }

  // Favorite operations
  async getFavoritesByUserId(userId: number): Promise<{favorite: Favorite, affirmation: Affirmation}[]> {
    const result = await db
      .select({
        favorite: favorites,
        affirmation: affirmations,
      })
      .from(favorites)
      .innerJoin(affirmations, eq(favorites.affirmationId, affirmations.id))
      .where(eq(favorites.userId, userId));
    
    return result;
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const results = await db.insert(favorites).values(insertFavorite).returning();
    return results[0];
  }

  async removeFavorite(userId: number, affirmationId: number): Promise<void> {
    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.affirmationId, affirmationId)
        )
      );
  }

  async isFavorite(userId: number, affirmationId: number): Promise<boolean> {
    const results = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.affirmationId, affirmationId)
        )
      );
    
    return results.length > 0;
  }
}