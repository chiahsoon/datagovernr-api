import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPlaintextHashAndSaltToDGFile1643460104100 implements MigrationInterface {
    name = 'AddPlaintextHashAndSaltToDGFile1643460104100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dg_file" ADD "plaintextHash" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "dg_file" ADD "salt" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dg_file" DROP COLUMN "salt"`);
        await queryRunner.query(`ALTER TABLE "dg_file" DROP COLUMN "plaintextHash"`);
    }

}
