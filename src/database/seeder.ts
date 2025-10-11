import { DataSource } from 'typeorm';
import { Product } from '../entities/product';
import { User } from '../entities/user';
import * as bcrypt from 'bcrypt';

export const seedProducts = [
  {
    name: 'Laptop',
    price: 999.99,
    description:
      'A high-performance laptop suitable for all your computing needs.',
    img: '/images/laptop.jpg',
  },
  {
    name: 'Smartphone',
    price: 599.99,
    img: '/images/smartphone.jpg',
    description: 'A latest model smartphone with all the modern features.',
  },
  {
    name: 'Headphones',
    img: '/images/headphones.jpg',
    price: 199.99,
    description:
      'Noise-cancelling headphones for an immersive audio experience.',
  },
  {
    name: 'Smartwatch',
    price: 299.99,
    img: '/images/smartwatch.jpg',
    description:
      'A smartwatch with fitness tracking and notification features.',
  },
];

export const seedUsers = [
  {
    fullName: 'Admin User',
    username: 'admin',
    email: 'admin@mystore.com',
    password: 'admin123456', // Will be hashed
    role: 'admin',
  },
  {
    fullName: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'user123456', // Will be hashed
    role: 'user',
  },
];

export class DatabaseSeeder {
  constructor(private dataSource: DataSource) {}

  async seed(): Promise<void> {
    console.log('🌱 Starting database seeding...');

    try {
      await this.seedUsers();
      await this.seedProducts();
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  private async seedUsers(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);

    console.log('👤 Seeding users...');

    for (const userData of seedUsers) {
      const existingUser = await userRepository.findOne({
        where: [{ username: userData.username }, { email: userData.email }],
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = userRepository.create({
          ...userData,
          password: hashedPassword,
        });

        await userRepository.save(user);
        console.log(
          `   ✓ Created user: ${userData.username} (${userData.role})`,
        );
      } else {
        console.log(
          `   → User ${userData.username} already exists, skipping...`,
        );
      }
    }
  }

  private async seedProducts(): Promise<void> {
    const productRepository = this.dataSource.getRepository(Product);

    console.log('📦 Seeding products...');

    for (const productData of seedProducts) {
      const existingProduct = await productRepository.findOne({
        where: { name: productData.name },
      });

      if (!existingProduct) {
        const product = productRepository.create(productData);
        await productRepository.save(product);
        console.log(`   ✓ Created product: ${productData.name}`);
      } else {
        console.log(
          `   → Product ${productData.name} already exists, skipping...`,
        );
      }
    }
  }
}
