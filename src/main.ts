import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import methodOverride from 'method-override';
import * as express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/http-exception/http-exception.filter';
import connectSqlite3 from 'connect-sqlite3';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(cookieParser());

  // Create SQLite session store
  const SQLiteStore = connectSqlite3(session);

  // Enable session middleware with SQLite store
  app.use(
    session({
      store: new SQLiteStore({
        db: 'mystore.db',
        table: 'sessions',
      }),
      secret:
        process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false, // Changed to false - don't create session until something is stored
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      },
    }),
  );

  // Enable body parsing for form data
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Enable method override for PUT/DELETE from forms
  app.use(methodOverride('_method'));

  app.useGlobalPipes(new ValidationPipe());

  // Configure static assets path for production/development
  // Check if we're in a build directory (production) or source directory (development)
  const isProduction = __dirname.includes('dist') || process.env.RENDER;
  
  const publicPath = isProduction 
    ? join(__dirname, 'public') // In production, files are copied to dist/public
    : join(__dirname, '..', 'public'); // In development, files are in project root

  const viewsPath = isProduction
    ? join(__dirname, 'views') // In production, files are copied to dist/views
    : join(__dirname, '..', 'views'); // In development, files are in project root

  console.log('🗂️  Is Production:', isProduction);
  console.log('🗂️  Static assets path:', publicPath);
  console.log('🗂️  Views path:', viewsPath);
  console.log('🗂️  __dirname:', __dirname);
  console.log('🗂️  NODE_ENV:', process.env.NODE_ENV);
  console.log('🗂️  RENDER env var:', process.env.RENDER);

  // Add additional static file serving for images specifically
  app.use('/images', express.static(join(publicPath, 'images')));

  app.useStaticAssets(publicPath);
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('ejs');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error(err));
