import {Verifier} from '../entity/Verifier';


export interface Timestamper {
    addTimestamp: (data: string) => Promise<void>;
    getVerifications: (hashes: string[]) => Promise<string[]>; // [verifierId, verificationLink]
}
