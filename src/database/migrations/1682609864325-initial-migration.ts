import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1682609864325 implements MigrationInterface {
  name = 'initialMigration1682609864325';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TYPE "public"."users_role_enum" AS ENUM(\'USER\', \'ADMIN\')',
    );
    await queryRunner.query(
      `CREATE TABLE "users" 
                    (
                        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                        "full_name" character varying NOT NULL, 
                        "email" character varying NOT NULL, 
                        "password" character varying NOT NULL, 
                        "role" "public"."users_role_enum" NOT NULL, 
                        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), 
                        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
                    )`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_settings" 
                    (
                        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                        "user_id" uuid NOT NULL, "problems_list" character varying array, 
                        CONSTRAINT "REL_4ed056b9344e6f7d8d46ec4b30" UNIQUE ("user_id"), 
                        CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id")
                    )`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" 
                    ADD CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302" FOREIGN KEY ("user_id") 
                    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user_settings" DROP CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302"',
    );
    await queryRunner.query('DROP TABLE "user_settings"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TYPE "public"."users_role_enum"');
  }
}
