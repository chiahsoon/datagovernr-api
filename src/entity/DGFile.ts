import {Column, Entity, OneToMany, PrimaryColumn} from 'typeorm';
import {DGFileVerifier} from './DGFileVerifier';

@Entity()
export class DGFile {
    @PrimaryColumn({nullable: false})
        id: number;

    @Column({nullable: false})
        encryptedHash: string;

    @Column({nullable: false})
        plaintextHash: string;

    @Column({nullable: false})
        salt: string;

    @OneToMany(() => DGFileVerifier, (dgFileVerifier) => dgFileVerifier.verifier)
        dgFileVerifiers: DGFileVerifier[];
}
