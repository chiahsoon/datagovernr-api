import {MigrationInterface, QueryRunner} from "typeorm";

export class AddVerificationData1644910310937 implements MigrationInterface {
    name = 'AddVerificationData1644910310937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verifier" ADD "data" bytea`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verifier" DROP COLUMN "data"`);
    }

}
