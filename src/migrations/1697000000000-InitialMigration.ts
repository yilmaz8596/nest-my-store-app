import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1697000000000 implements MigrationInterface {
  name = 'InitialMigration1697000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "fullName" character varying(100) NOT NULL,
        "username" character varying(100) NOT NULL,
        "password" character varying NOT NULL,
        "email" character varying(100) NOT NULL,
        "role" character varying(20) NOT NULL DEFAULT 'user',
        CONSTRAINT "UQ_username" UNIQUE ("username"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create products table
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "img" character varying NOT NULL,
        "description" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_product_name" UNIQUE ("name"),
        CONSTRAINT "PK_products" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
