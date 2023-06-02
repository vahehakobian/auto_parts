import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSubscribeTable1685531066970 implements MigrationInterface {
  name = "updateSubscribeTable1685531066970";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."subscribe_subscribe_state_enum" AS ENUM('ACTIVE', 'PAUSE', 'STOP')`
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" ADD "subscribe_state" "public"."subscribe_subscribe_state_enum" NOT NULL DEFAULT 'ACTIVE'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscribe" DROP COLUMN "subscribe_state"`
    );
    await queryRunner.query(
      `DROP TYPE "public"."subscribe_subscribe_state_enum"`
    );
  }
}
