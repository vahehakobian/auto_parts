import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTokenTable1683411305678 implements MigrationInterface {
  name = 'createTokenTable1683411305678';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_tokens_type_enum\" AS ENUM('ACCESS_TOKEN', 'VERIFY_ACCOUNT', 'FORGOT_PASSWORD', 'EMAIL_CHANGE')",
    );
    await queryRunner.query(
      'CREATE TABLE "users_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "token" character varying NOT NULL, "type" "public"."users_tokens_type_enum" NOT NULL, CONSTRAINT "UQ_16796eb52a059007e7e4f5fa72e" UNIQUE ("token"), CONSTRAINT "UQ_c7178ae495d0ae58b04304a54c2" UNIQUE ("user_id", "type"), CONSTRAINT "PK_9f236389174a6ccbd746f53dca8" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_16796eb52a059007e7e4f5fa72" ON "users_tokens" ("token") ',
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_is_verified_enum\" AS ENUM('VERIFIED', 'NOT_VERIFIED', 'PENDING')",
    );
    await queryRunner.query(
      'ALTER TABLE "users" ADD "is_verified" "public"."users_is_verified_enum" NOT NULL DEFAULT \'PENDING\'',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" ALTER COLUMN "is_verified" SET DEFAULT \'PENDING\'',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" ALTER COLUMN "is_verified" SET DEFAULT \'PENDING\'-part_is_verified_enum"',
    );
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "is_verified"');
    await queryRunner.query('DROP TYPE "public"."users_is_verified_enum"');
    await queryRunner.query(
      'DROP INDEX "public"."IDX_16796eb52a059007e7e4f5fa72"',
    );
    await queryRunner.query('DROP TABLE "users_tokens"');
    await queryRunner.query('DROP TYPE "public"."users_tokens_type_enum"');
  }
}
