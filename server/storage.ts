import { 
  users, type User, type InsertUser,
  affirmations, type Affirmation, type InsertAffirmation,
  categories, type Category, type InsertCategory,
  moods, type Mood, type InsertMood,
  favorites, type Favorite, type InsertFavorite
} from "@shared/schema";

// Define storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStreak(userId: number, streak: number): Promise<User>;
  updateUserPreferences(userId: number, preferences: any): Promise<User>;
  
  // Affirmation operations
  getAffirmation(id: number): Promise<Affirmation | undefined>;
  getAffirmationsByCategory(category: string): Promise<Affirmation[]>;
  getAllAffirmations(): Promise<Affirmation[]>;
  createAffirmation(affirmation: InsertAffirmation): Promise<Affirmation>;
  getDailyAffirmation(): Promise<Affirmation>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Mood operations
  getMoodsByUserId(userId: number): Promise<Mood[]>;
  createMood(mood: InsertMood): Promise<Mood>;
  getTodaysMood(userId: number): Promise<Mood | undefined>;
  
  // Favorite operations
  getFavoritesByUserId(userId: number): Promise<{favorite: Favorite, affirmation: Affirmation}[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, affirmationId: number): Promise<void>;
  isFavorite(userId: number, affirmationId: number): Promise<boolean>;
}

// Import the database storage implementation
import { DatabaseStorage } from './database-storage';

// Export an instance of the database storage
export const storage = new DatabaseStorage();