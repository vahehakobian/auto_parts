import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTables1685708774846 implements MigrationInterface {
  name = "updateTables1685708774846";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vehicle_part" ADD "keyword" character varying(15) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" ADD "year_from" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" ADD "year_to" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" ADD "min_price" integer DEFAULT '0'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subscribe" DROP COLUMN "min_price"`);
    await queryRunner.query(`ALTER TABLE "subscribe" DROP COLUMN "year_to"`);
    await queryRunner.query(`ALTER TABLE "subscribe" DROP COLUMN "year_from"`);
    await queryRunner.query(`ALTER TABLE "vehicle_part" DROP COLUMN "keyword"`);
  }
}
