import { db } from '../models/prismaClient';
import { seed } from './seed';

async function runSeed() {
  try {
    console.log(`🌱 Seeding database: ${process.env.NODE_ENV} environment 🌱 `);
    await seed();
    console.log('🌴 Done seeding 🌴');
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    db.$disconnect();
  }
}

runSeed();
