import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVehicleBrandModelTables1682948686599
  implements MigrationInterface
{
  name = 'createVehicleBrandModelTables1682948686599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "vehicle_brand" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_ea43c4dbdf99e6608ad7bcf7657" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "vehicle_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "brand_id" uuid, CONSTRAINT "PK_557870ce4ace117b16a56c42bda" PRIMARY KEY ("id"))',
    );
    await queryRunner.query('ALTER TABLE "vehicle-part" ADD "model_id" uuid');
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" ALTER COLUMN "is_verified" SET DEFAULT \'PENDING\'',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle_model" ADD CONSTRAINT "FK_d2d4124c608ccc8c3c37cdee1f6" FOREIGN KEY ("brand_id") REFERENCES "vehicle_brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" ADD CONSTRAINT "FK_9fdb45315b7dd3739eab253274e" FOREIGN KEY ("model_id") REFERENCES "vehicle_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" DROP CONSTRAINT "FK_9fdb45315b7dd3739eab253274e"',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle_model" DROP CONSTRAINT "FK_d2d4124c608ccc8c3c37cdee1f6"',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" ALTER COLUMN "is_verified" SET DEFAULT \'PENDING\'-part_is_verified_enum"',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" DROP COLUMN "model_id"',
    );
    await queryRunner.query('DROP TABLE "vehicle_model"');
    await queryRunner.query('DROP TABLE "vehicle_brand"');
  }
}
