import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product';
import { ProductDTO } from '../../DTO/product.dto';
import { EditProductDTO } from '../../DTO/edit.product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async addProduct(product: ProductDTO): Promise<ProductDTO> {
    const { name, price, img, description } = product;
    const newProduct = this.repo.create({
      name,
      price,
      img,
      description,
    });
    return await this.repo.save(newProduct);
  }

  async getAllProducts(): Promise<ProductDTO[]> {
    const products = await this.repo.find();
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      description: product.description,
      createdAt: product.createdAt,
    }));
  }

  async getProductById(id: number): Promise<ProductDTO> {
    const product = await this.repo.findOneBy({ id });
    return {
      id: product?.id || 0,
      name: product?.name || '',
      price: product?.price || 0,
      img: product?.img || '',
      description: product?.description || '',
      createdAt: product?.createdAt || new Date(),
    };
  }

  async editProduct(id: number, productData: EditProductDTO) {
    const product = await this.repo.findOneBy({ id });
    if (!product) {
      throw new Error('Product not found');
    }

    const { name, price, img, description } = productData;
    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.img = img ?? product.img;
    product.description = description ?? product.description;

    return await this.repo.save(product);
  }

  async deleteProduct(id: number) {
    const product = await this.repo.findOneBy({ id });
    if (!product) {
      throw new Error('Product not found');
    }
    await this.repo.remove(product);
  }
}
