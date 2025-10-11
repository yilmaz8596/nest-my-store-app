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
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error(err));
