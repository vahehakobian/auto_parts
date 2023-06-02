import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubscribeTable1685453056442 implements MigrationInterface {
  name = "createSubscribeTable1685453056442";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "subscribe" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "subscribe" character varying NOT NULL, "user_id" uuid, "model_id" uuid, CONSTRAINT "PK_3e91e772184cd3feb30688ef1b8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "vehicle_part" DROP COLUMN "year"`);
    await queryRunner.query(
      `ALTER TABLE "vehicle_part" ADD "year_from" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "vehicle_part" ADD "year_to" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" ADD CONSTRAINT "FK_81a2738021382c267e417571dec" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" ADD CONSTRAINT "FK_a1602cee991ee98c2847e0e2a17" FOREIGN KEY ("model_id") REFERENCES "vehicle_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscribe" DROP CONSTRAINT "FK_a1602cee991ee98c2847e0e2a17"`
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" DROP CONSTRAINT "FK_81a2738021382c267e417571dec"`
    );
    await queryRunner.query(`ALTER TABLE "vehicle_part" DROP COLUMN "year_to"`);
    await queryRunner.query(
      `ALTER TABLE "vehicle_part" DROP COLUMN "year_from"`
    );
    await queryRunner.query(
      `ALTER TABLE "vehicle_part" ADD "year" integer NOT NULL`
    );
    await queryRunner.query(`DROP TABLE "subscribe"`);
  }
}
