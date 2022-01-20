import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDGFile1642690538918 implements MigrationInterface {
    name = 'AddDGFile1642690538918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dg_file" ("id" integer NOT NULL, "encryptedHash" character varying NOT NULL, CONSTRAINT "PK_4a59414c1007268d66ea165cb67" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "dg_file"`);
    }

}
