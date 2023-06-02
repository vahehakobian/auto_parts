import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateVehiclePartTable1683548302214 implements MigrationInterface {
  name = 'updateVehiclePartTable1683548302214';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "vehicle_brand" ADD CONSTRAINT "UQ_f856855f29f763be246716f809a" UNIQUE ("name")',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle_part" DROP CONSTRAINT "UQ_d292b69b30b307d206f89a6dbb3"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "vehicle_part" ADD CONSTRAINT "UQ_d292b69b30b307d206f89a6dbb3" UNIQUE ("name")',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle_brand" DROP CONSTRAINT "UQ_f856855f29f763be246716f809a"',
    );
  }
}
