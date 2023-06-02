import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CrteateWishListTable1683462466427 implements MigrationInterface {
  name = 'crteateWishListTable1683462466427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wish_list" 
            (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "user_id" uuid, "vehicle_id" uuid, 
                CONSTRAINT "PK_f8e27bbb59891db7cd9f920c272" PRIMARY KEY ("id")
            )`,
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" ALTER COLUMN "is_verified" SET DEFAULT \'PENDING\'',
    );
    await queryRunner.query(
      `ALTER TABLE "wish_list" 
            ADD CONSTRAINT "FK_c23debb14a44001e4c5ffb3169d" FOREIGN KEY ("user_id") 
            REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish_list" 
            ADD CONSTRAINT "FK_e70def85ca4591329ce1137b1b3" FOREIGN KEY ("vehicle_id") 
            REFERENCES "vehicle-part"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "wish_list" DROP CONSTRAINT "FK_e70def85ca4591329ce1137b1b3"',
    );
    await queryRunner.query(
      'ALTER TABLE "wish_list" DROP CONSTRAINT "FK_c23debb14a44001e4c5ffb3169d"',
    );
    await queryRunner.query(
      'ALTER TABLE "vehicle-part" ALTER COLUMN "is_verified" SET DEFAULT \'PENDING\'-part_is_verified_enum"',
    );
    await queryRunner.query('DROP TABLE "wish_list"');
  }
}
