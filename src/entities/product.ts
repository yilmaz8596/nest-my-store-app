import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true, nullable: false, length: 100 })
  name: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
  @Column({ nullable: false })
  img: string;
  @Column({ nullable: false })
  description: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
