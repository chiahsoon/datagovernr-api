import {MigrationInterface, QueryRunner} from "typeorm";

export class AddVerifierAndDGFileVerifier1642744099547 implements MigrationInterface {
    name = 'AddVerifierAndDGFileVerifier1642744099547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "verifier" ("id" SERIAL NOT NULL, "link" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b72ba840a5a8301e0a686fba6b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dg_file_verifier" ("verifierId" integer NOT NULL, "dgFileId" integer NOT NULL, CONSTRAINT "PK_38f2d150ff82d0237252b6e3125" PRIMARY KEY ("verifierId", "dgFileId"))`);
        await queryRunner.query(`ALTER TABLE "dg_file_verifier" ADD CONSTRAINT "FK_b65e8828d6d1bd7d1e7b162498d" FOREIGN KEY ("verifierId") REFERENCES "verifier"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dg_file_verifier" ADD CONSTRAINT "FK_3073297b34485720a4cd3317ebc" FOREIGN KEY ("dgFileId") REFERENCES "dg_file"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dg_file_verifier" DROP CONSTRAINT "FK_3073297b34485720a4cd3317ebc"`);
        await queryRunner.query(`ALTER TABLE "dg_file_verifier" DROP CONSTRAINT "FK_b65e8828d6d1bd7d1e7b162498d"`);
        await queryRunner.query(`DROP TABLE "dg_file_verifier"`);
        await queryRunner.query(`DROP TABLE "verifier"`);
    }

}
