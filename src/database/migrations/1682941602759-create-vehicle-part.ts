import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVehiclePart1682941602759 implements MigrationInterface {
  name = 'createVehiclePart1682941602759';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user_settings" DROP CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302"',
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"vehicle-part_category_enum\" AS ENUM('PASSENGER', 'TRUCK', 'MOTOTECHNICS', 'SPECIAL_TECHNICS', 'BUS', 'TRAILER', 'WATER_TECHNOLOGY')",
    );
    await queryRunner.query(
      'CREATE TYPE "public"."vehicle-part_custom_cleared_enum" AS ENUM(\'CLEARED\', \'NOT_CLEARED\')',
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"vehicle-part_body_type_enum\" AS ENUM('SEDAN', 'HATCHBACK', 'UNIVERSAL', 'COUPE', 'CONVERTIBLE', 'SUV', 'PICKUP', 'MINIVEN', 'FURGON', 'LIMUZIN')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"vehicle-part_price_type_enum\" AS ENUM('USD', 'EUR', 'RUB', 'AMD')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"vehicle-part_fuel_type_enum\" AS ENUM('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'GAS', 'LIQUEFIED_GAS')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"vehicle-part_is_verified_enum\" AS ENUM('VERIFIED', 'NOT_VERIFIED', 'PENDING')",
    );
    await queryRunner.query(
      'CREATE TABLE "vehicle-part" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category" "public"."vehicle-part_category_enum" NOT NULL, "custom_cleared" "public"."vehicle-part_custom_cleared_enum" NOT NULL, "body_type" "public"."vehicle-part_body_type_enum" NOT NULL, "price_type" "public"."vehicle-part_price_type_enum" NOT NULL, "payment_conditional" boolean, "price" integer, "fuel_type" "public"."vehicle-part_fuel_type_enum" NOT NULL, "milage" character varying NOT NULL, "engine" character varying NOT NULL, "color" character varying NOT NULL, "year" integer NOT NULL, "views" integer NOT NULL DEFAULT \'0\', "is_verified" "public"."vehicle-part_is_verified_enum" NOT NULL DEFAULT \'PENDING\', "user_id" uuid, CONSTRAINT "PK_d64ec23a4fe0fe7fc648809784a" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'ALTER TABLE "user_settings" DROP CONSTRAINT "REL_4ed056b9344e6f7d8d46ec4b30"',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" ADD CONSTRAINT "FK_4edc823d646d3922e63d81a5873" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" DROP CONSTRAINT "FK_4edc823d646d3922e63d81a5873"',
    );
    await queryRunner.query(
      'ALTER TABLE "user_settings" ADD CONSTRAINT "REL_4ed056b9344e6f7d8d46ec4b30" UNIQUE ("user_id")',
    );
    await queryRunner.query('DROP TABLE "vehicle-part"');
    await queryRunner.query(
      'DROP TYPE "public"."vehicle-part_is_verified_enum"',
    );
    await queryRunner.query('DROP TYPE "public"."vehicle-part_fuel_type_enum"');
    await queryRunner.query(
      'DROP TYPE "public"."vehicle-part_price_type_enum"',
    );
    await queryRunner.query('DROP TYPE "public"."vehicle-part_body_type_enum"');
    await queryRunner.query(
      'DROP TYPE "public"."vehicle-part_custom_cleared_enum"',
    );
    await queryRunner.query('DROP TYPE "public"."vehicle-part_category_enum"');
    await queryRunner.query(
      'ALTER TABLE "user_settings" ADD CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE',
    );
  }
}
