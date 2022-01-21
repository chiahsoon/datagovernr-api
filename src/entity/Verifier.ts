import {Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import {DGFileVerifier} from './DGFileVerifier';

@Entity()
export class Verifier {
    @PrimaryGeneratedColumn()
        id: number;

    @Column({nullable: false})
        link: string;

    @CreateDateColumn({nullable: false})
        createdDate: Date;

    @OneToMany(() => DGFileVerifier, (dgFileVerifier) => dgFileVerifier.verifier)
        dgFileVerifiers: DGFileVerifier[];
}
