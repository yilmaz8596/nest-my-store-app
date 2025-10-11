#!/usr/bin/env node

import { DataSource } from 'typeorm';
import { Product } from '../entities/product';
import { User } from '../entities/user';
import { DatabaseSeeder } from '../database/seeder';

// Database configuration based on environment
const getDatabaseConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    return {
      type: 'postgres' as const,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl:
        process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };
  } else {
    return {
      type: 'sqlite' as const,
      database: process.env.SQLITE_DATABASE || 'mystore.db',
    };
  }
};

async function runSeeder() {
  console.log('🚀 Initializing database connection...');

  const dataSource = new DataSource({
    ...getDatabaseConfig(),
    entities: [Product, User],
    synchronize: false,
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');

    const seeder = new DatabaseSeeder(dataSource);
    await seeder.seed();

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeder
runSeeder().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
