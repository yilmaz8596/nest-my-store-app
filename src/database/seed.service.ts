import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DatabaseSeeder } from '../database/seeder';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    // Only seed in production or when explicitly requested
    const shouldSeed =
      process.env.NODE_ENV === 'production' ||
      process.env.SEED_DATABASE === 'true';

    if (shouldSeed) {
      console.log('🌱 Auto-seeding database on startup...');
      await this.seedDatabase();
    }
  }

  async seedDatabase(): Promise<void> {
    try {
      const seeder = new DatabaseSeeder(this.dataSource);
      await seeder.seed();
    } catch (error) {
      console.error('Failed to seed database:', error);
      // Don't throw error to prevent app from crashing
    }
  }
}
