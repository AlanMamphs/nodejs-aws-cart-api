import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703464598454 implements MigrationInterface {
    name = 'Migration1703464598454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" ADD "product" json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "product"`);
    }

}
