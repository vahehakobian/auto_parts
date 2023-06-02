import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateVehiclePart1683403377268 implements MigrationInterface {
  name = 'updateVehiclePart1683403377268';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" ADD "name" character varying',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" ADD "description" text',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" ALTER COLUMN "is_verified" SET DEFAULT \'PENDING\'',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" ALTER COLUMN "is_verified" SET DEFAULT \'PENDING\'-part_is_verified_enum"',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" DROP COLUMN "description"',
    );
    await queryRunner.query('ALTER TABLE "vehicle-part" DROP COLUMN "name"');
  }
}
