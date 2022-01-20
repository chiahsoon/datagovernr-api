import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class DGFile {
    @PrimaryColumn({nullable: false})
        id: number;

    @Column({nullable: false})
        encryptedHash: string;
}
