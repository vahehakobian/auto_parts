import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateVehiclePartTable1683547457417 implements MigrationInterface {
  name = 'updateVehiclePartTable1683547457417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "wish_list" DROP CONSTRAINT "FK_e70def85ca4591329ce1137b1b3"',
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"vehicle_part_category_enum\" AS ENUM('PASSENGER', 'TRUCK', 'MOTOTECHNICS', 'SPECIAL_TECHNICS', 'BUS', 'TRAILER', 'WATER_TECHNOLOGY')",
    );
    await queryRunner.query(
      'CREATE TYPE "public"."vehicle_part_custom_cleared_enum" AS ENUM(\'CLEARED\', \'NOT_CLEARED\')',
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"vehicle_part_body_type_enum\" AS ENUM('SEDAN', 'HATCHBACK', 'UNIVERSAL', 'COUPE', 'CONVERTIBLE', 'SUV', 'PICKUP', 'MINIVEN', 'FURGON', 'LIMUZIN')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"vehicle_part_price_type_enum\" AS ENUM('USD', 'EUR', 'RUB', 'AMD')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"vehicle_part_fuel_type_enum\" AS ENUM('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'GAS', 'LIQUEFIED_GAS')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"vehicle_part_is_verified_enum\" AS ENUM('VERIFIED', 'NOT_VERIFIED', 'PENDING')",
    );
    await queryRunner.query(
      'CREATE TABLE "vehicle_part" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying, "category" "public"."vehicle_part_category_enum" NOT NULL, "custom_cleared" "public"."vehicle_part_custom_cleared_enum" NOT NULL, "body_type" "public"."vehicle_part_body_type_enum" NOT NULL, "price_type" "public"."vehicle_part_price_type_enum" NOT NULL, "payment_conditional" boolean, "price" integer, "fuel_type" "public"."vehicle_part_fuel_type_enum" NOT NULL, "milage" character varying NOT NULL, "engine" character varying NOT NULL, "color" character varying NOT NULL, "year" integer NOT NULL, "views" integer NOT NULL DEFAULT \'0\', "is_verified" "public"."vehicle_part_is_verified_enum" NOT NULL DEFAULT \'PENDING\', "description" text, "model_id" uuid, "user_id" uuid, CONSTRAINT "UQ_d292b69b30b307d206f89a6dbb3" UNIQUE ("name"), CONSTRAINT "PK_f1796d7f6df216655d629bc07da" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      `DROP TABLE "vehicle-part"`
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle_model" ADD CONSTRAINT "UQ_e193833944ed4fa9f6f2683a496" UNIQUE ("name")',
    );
    await queryRunner.query(
      'ALTER TABLE "wish_list" ADD CONSTRAINT "FK_e70def85ca4591329ce1137b1b3" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle_part"("id") ON DELETE CASCADE ON UPDATE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle_part" ADD CONSTRAINT "FK_19af8c67d450fd72966c88325e1" FOREIGN KEY ("model_id") REFERENCES "vehicle_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle_part" ADD CONSTRAINT "FK_cd39b2dbb0b81bff842e2554a98" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "vehicle_part" DROP CONSTRAINT "FK_cd39b2dbb0b81bff842e2554a98"',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle_part" DROP CONSTRAINT "FK_19af8c67d450fd72966c88325e1"',
    );
    await queryRunner.query(
      'ALTER TABLE "wish_list" DROP CONSTRAINT "FK_e70def85ca4591329ce1137b1b3"',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle_model" DROP CONSTRAINT "UQ_e193833944ed4fa9f6f2683a496"',
    );
    await queryRunner.query('DROP TABLE "vehicle_part"');
    await queryRunner.query(
      'DROP TYPE "public"."vehicle_part_is_verified_enum"',
    );
    await queryRunner.query('DROP TYPE "public"."vehicle_part_fuel_type_enum"');
    await queryRunner.query(
      'DROP TYPE "public"."vehicle_part_price_type_enum"',
    );
    await queryRunner.query('DROP TYPE "public"."vehicle_part_body_type_enum"');
    await queryRunner.query(
      'DROP TYPE "public"."vehicle_part_custom_cleared_enum"',
    );
    await queryRunner.query('DROP TYPE "public"."vehicle_part_category_enum"');
    await queryRunner.query(
      'ALTER TABLE "wish_list" ADD CONSTRAINT "FK_e70def85ca4591329ce1137b1b3" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle-part"("id") ON DELETE CASCADE ON UPDATE CASCADE',
    );
  }
}
