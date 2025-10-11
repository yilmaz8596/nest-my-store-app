import { Module } from '@nestjs/common';
import { AppController, RootController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/module/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product';
import { UserModule } from './users/module/user/user.module';
import { User } from './entities/user';
import { SeedService } from './database/seed.service';

// Database configuration based on environment
const getDatabaseConfig = () => {
  // Check if we have PostgreSQL environment variables
  const hasPostgresConfig =
    process.env.DB_HOST &&
    process.env.DB_NAME &&
    process.env.DB_USERNAME &&
    process.env.DB_PASSWORD;

  if (hasPostgresConfig) {
    // PostgreSQL configuration for production
    return {
      type: 'postgres' as const,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl:
        process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      synchronize: false, // Always false in production with PostgreSQL
    };
  } else {
    // SQLite configuration for development/deployment without PostgreSQL
    return {
      type: 'sqlite' as const,
      database: process.env.SQLITE_DATABASE || 'mystore.db',
      synchronize: true, // OK for SQLite
    };
  }
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...getDatabaseConfig(),
      entities: [Product, User],
      logging: process.env.NODE_ENV === 'development',
    }),
    ProductsModule,
    UserModule,
  ],
  controllers: [AppController, RootController],
  providers: [AppService, SeedService],
})
export class AppModule {}
