import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeVerificationLinkNullable1644814491591 implements MigrationInterface {
    name = 'MakeVerificationLinkNullable1644814491591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verifier" ALTER COLUMN "link" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verifier" ALTER COLUMN "link" SET NOT NULL`);
    }

}
