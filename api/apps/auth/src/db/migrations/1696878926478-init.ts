import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1696878926478 implements MigrationInterface {
    name = 'Init1696878926478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "firstName" character varying(80)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName" character varying(80)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(80)`);
    }

}
