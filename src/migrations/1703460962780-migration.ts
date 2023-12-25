import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703460962780 implements MigrationInterface {
    name = 'Migration1703460962780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "user_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "user_id" uuid NOT NULL`);
    }

}
