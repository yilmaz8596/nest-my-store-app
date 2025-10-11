import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/module/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product';
import { UserModule } from './users/module/user/user.module';
import { User } from './entities/user';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'mystore.db',
      entities: [Product, User],
      synchronize: true,
    }),
    ProductsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
