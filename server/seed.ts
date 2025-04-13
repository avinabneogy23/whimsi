import { db } from './db';
import { 
  users, 
  affirmations, 
  categories, 
  moods, 
  favorites 
} from '@shared/schema';
import { eq } from 'drizzle-orm';

async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Clear existing data (optional, comment out if you want to keep existing data)
  try {
    await db.delete(favorites);
    await db.delete(moods);
    await db.delete(affirmations);
    await db.delete(categories);
    await db.delete(users);
    console.log('Cleared existing data');
  } catch (error) {
    console.error('Error clearing existing data:', error);
  }

  try {
    // Create sample users
    console.log('Creating sample users...');
    const [user] = await db.insert(users).values({
      username: "demo",
      password: "password",
      firstName: "Demo",
      preferences: {
        categories: ["Mindfulness", "Gratitude"],
        darkMode: false,
        notificationsEnabled: true,
        notificationTime: "08:00",
        backgroundMusicEnabled: true
      },
      currentStreak: 5
    }).returning();
    
    console.log(`Created user with ID: ${user.id}`);

    // Create sample categories
    console.log('Creating sample categories...');
    const categoryData = [
      { name: "Self Love", description: "Affirmations focusing on loving yourself.", count: 5, imagePath: null },
      { name: "Abundance", description: "Affirmations focusing on attracting abundance.", count: 3, imagePath: null },
      { name: "Confidence", description: "Affirmations to boost self-confidence.", count: 4, imagePath: null },
      { name: "Mindfulness", description: "Affirmations for staying present and mindful.", count: 3, imagePath: null },
      { name: "Gratitude", description: "Affirmations for cultivating gratitude.", count: 3, imagePath: null },
    ];

    const createdCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`Created ${createdCategories.length} categories`);

    // Create sample affirmations
    console.log('Creating sample affirmations...');
    const affirmationData = [
      { text: "I am capable of amazing things, and today I choose to focus on the positive.", category: "Self Love", audioPath: "affirmation1.mp3" },
      { text: "I am worthy of love, respect, and kindness from myself and others.", category: "Self Love", audioPath: "affirmation2.mp3" },
      { text: "Every day I am becoming a better version of myself.", category: "Self Love", audioPath: "affirmation3.mp3" },
      { text: "I attract abundance and prosperity effortlessly.", category: "Abundance", audioPath: "affirmation4.mp3" },
      { text: "The universe is working in my favor, bringing me endless opportunities.", category: "Abundance", audioPath: "affirmation5.mp3" },
      { text: "I am confident in my abilities and trust my decisions.", category: "Confidence", audioPath: "affirmation6.mp3" },
      { text: "I face challenges with courage and determination.", category: "Confidence", audioPath: "affirmation7.mp3" },
      { text: "I am present in this moment and grateful for all I have.", category: "Mindfulness", audioPath: "affirmation8.mp3" },
      { text: "I choose to focus on what brings me joy and peace.", category: "Mindfulness", audioPath: "affirmation9.mp3" },
      { text: "I am thankful for the abundance of blessings in my life.", category: "Gratitude", audioPath: "affirmation10.mp3" },
    ];

    const createdAffirmations = await db.insert(affirmations).values(affirmationData).returning();
    console.log(`Created ${createdAffirmations.length} affirmations`);

    // Create sample moods
    console.log('Creating sample moods...');
    await db.insert(moods).values({
      userId: user.id,
      mood: "happy",
      date: new Date()
    });

    // Create yesterday's mood
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    await db.insert(moods).values({
      userId: user.id,
      mood: "content",
      date: yesterday
    });
    console.log(`Created sample moods for user ${user.id}`);

    // Add sample favorites
    console.log('Creating sample favorites...');
    await db.insert(favorites).values([
      {
        userId: user.id,
        affirmationId: createdAffirmations[0].id
      },
      {
        userId: user.id,
        affirmationId: createdAffirmations[3].id
      }
    ]);
    console.log(`Created sample favorites for user ${user.id}`);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seedDatabase().catch(console.error);