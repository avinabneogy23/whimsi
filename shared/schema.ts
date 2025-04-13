import { pgTable, text, serial, timestamp, integer, jsonb, foreignKey, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  preferences: jsonb("preferences").notNull().$type<UserPreferences>(),
  currentStreak: integer("current_streak").notNull().default(0),
});

export const usersRelations = relations(users, ({ many }) => ({
  moods: many(moods),
  favorites: many(favorites),
}));

export type UserPreferences = {
  categories: string[];
  darkMode: boolean;
  notificationsEnabled: boolean;
  notificationTime: string;
  backgroundMusicEnabled: boolean;
};

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  preferences: true,
  currentStreak: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Affirmation model
export const affirmations = pgTable("affirmations", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  category: text("category").notNull(),
  audioPath: text("audio_path"),
});

export const affirmationsRelations = relations(affirmations, ({ many }) => ({
  favorites: many(favorites),
}));

export const insertAffirmationSchema = createInsertSchema(affirmations).pick({
  text: true,
  category: true,
  audioPath: true,
});

export type InsertAffirmation = z.infer<typeof insertAffirmationSchema>;
export type Affirmation = typeof affirmations.$inferSelect;

// Category model
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  count: integer("count").notNull().default(0),
  imagePath: text("image_path"),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  count: true,
  imagePath: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Mood model
export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  mood: text("mood").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const moodsRelations = relations(moods, ({ one }) => ({
  user: one(users, {
    fields: [moods.userId],
    references: [users.id],
  }),
}));

export const insertMoodSchema = createInsertSchema(moods).pick({
  userId: true,
  mood: true,
  date: true,
});

export type InsertMood = z.infer<typeof insertMoodSchema>;
export type Mood = typeof moods.$inferSelect;

// Favorite affirmations
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  affirmationId: integer("affirmation_id").notNull().references(() => affirmations.id, { onDelete: 'cascade' }),
}, (table) => {
  return {
    userAffirmationIdx: uniqueIndex("user_affirmation_idx").on(table.userId, table.affirmationId),
  };
});

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  affirmation: one(affirmations, {
    fields: [favorites.affirmationId],
    references: [affirmations.id],
  }),
}));

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  affirmationId: true,
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;
