import {Verifier} from '../entity/Verifier';
import {DGFile} from '../entity/DGFile';

export interface VerificationDetails {
    verifier?: Verifier
    files: DGFile[]
}
