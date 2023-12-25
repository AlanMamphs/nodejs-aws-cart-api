import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703463853646 implements MigrationInterface {
    name = 'Migration1703463853646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_1148e12556e3c41f07ad2c7719a"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "cart_item_id" TO "product_id"`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_1de6a4421ff0c410d75af27aeee" FOREIGN KEY ("product_id") REFERENCES "cart_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_1de6a4421ff0c410d75af27aeee"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "product_id" TO "cart_item_id"`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_1148e12556e3c41f07ad2c7719a" FOREIGN KEY ("cart_item_id") REFERENCES "cart_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
