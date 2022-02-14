import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {DGFileVerifier} from './DGFileVerifier';

@Entity()
export class Verifier {
    @PrimaryGeneratedColumn()
        id: number;

    @Column({nullable: true})
        link: string;

    @CreateDateColumn({nullable: false})
        createdDate: Date;

    @OneToMany(() => DGFileVerifier, (dgFileVerifier) => dgFileVerifier.verifier)
        dgFileVerifiers: DGFileVerifier[];
}
