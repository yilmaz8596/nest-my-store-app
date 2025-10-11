import { Module } from '@nestjs/common';
import { ProductsController } from '../controller/products.controller';
import { ProductsService } from '../service/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entities/product';
import { UserModule } from '../../users/module/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UserModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
