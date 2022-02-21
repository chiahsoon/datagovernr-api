import {Column, Entity, ManyToOne, PrimaryColumn} from 'typeorm';
import {Verifier} from './Verifier';
import {DGFile} from './DGFile';

@Entity()
export class DGFileVerifier {
    constructor(dgFileId: number, verifierId: number) {
        this.dgFileId = dgFileId;
        this.verifierId = verifierId;
    }

    @ManyToOne(() => Verifier, (verifier) => verifier.dgFileVerifiers, {
        onDelete: 'CASCADE',
        nullable: false,
    })
        verifier: Verifier;

    @ManyToOne(() => DGFile, (dgFile) => dgFile.dgFileVerifiers, {
        onDelete: 'CASCADE',
        nullable: false,
    })
        dgFile: DGFile;

    @PrimaryColumn()
        verifierId: number;

    @PrimaryColumn()
        dgFileId: number;
}
