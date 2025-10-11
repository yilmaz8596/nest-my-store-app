import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100 })
  fullName: string;

  @Column({ unique: true, nullable: false, length: 100 })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, length: 100 })
  email: string;

  @Column({ default: 'user', length: 20 })
  role: string;
}
