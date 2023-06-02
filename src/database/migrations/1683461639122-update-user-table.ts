import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTable1683461639122 implements MigrationInterface {
  name = 'updateUserTable1683461639122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" ADD "phone" character varying NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ADD "avatar" character varying',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ADD "viber" character varying',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ADD "whatsapp" character varying',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" ALTER COLUMN "is_verified" SET DEFAULT \'PENDING\'',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" ALTER COLUMN "is_verified" SET DEFAULT \'PENDING\'-part_is_verified_enum"',
    );
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "whatsapp"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "viber"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "avatar"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "phone"');
  }
}
