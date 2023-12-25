import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703491310379 implements MigrationInterface {
    name = 'Migration1703491310379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "shipping" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_80e7dab6784d24de6d5676369b2" UNIQUE ("shipping")`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_80e7dab6784d24de6d5676369b2"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "shipping"`);
    }

}
