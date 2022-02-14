import {getRepository} from 'typeorm';
import {DGFile} from '../entity/DGFile';
import {DGFileVerifier} from '../entity/DGFileVerifier';
import {Verifier} from '../entity/Verifier';
import {Timestamper} from '../services/timestamper';

export const getTimestampAllFn = (timestamper: Timestamper): (() => void) => {
    return async () => {
        const currentTime = new Date().toISOString();
        try {
            const fileVerifiers = getRepository(DGFileVerifier)
                .createQueryBuilder('dg_file_verifier')
                .select('dg_file_verifier.dgFileId');
            const files = await getRepository(DGFile)
                .createQueryBuilder('dg_file')
                .where('dg_file.id NOT IN (' + fileVerifiers.getSql() + ')')
                .orderBy('dg_file.id')
                .getMany();
            const hashConcat = aggregateHashes(files);
            await timestamper.addTimestamp(hashConcat);
            const newVerifier = await getRepository(Verifier).save(new Verifier());
            const newFileVerifiers = files.map((file) => new DGFileVerifier(file.id, newVerifier.id));
            await getRepository(DGFileVerifier).save(newFileVerifiers);

            console.log('Finished timestamping at ' + currentTime);
        } catch (err) {
            console.log('Failed to add timestamps at ' + currentTime);
            console.log('Error: ', err);
        }
    };
};

export const getUpdateVerificationLinkFn = (timestamper: Timestamper): (() => void) => {
    return async () => {
        const currentTime = new Date().toISOString();
        try {
            // TODO: Consider saving aggregated hash to avoid needing other relations
            const verifiers = await getRepository(Verifier).find({
                where: {link: null},
                relations: ['dgFileVerifiers', 'dgFileVerifiers.dgFile'],
            });
            const fileVerifiers = verifiers.map((v) => v.dgFileVerifiers);
            const verifierFiles = fileVerifiers.map((v) => v.map((fv) => fv.dgFile));
            const hashes = verifierFiles.map((files) => aggregateHashes(files));
            const links = await timestamper.getVerifications(hashes);
            verifiers.forEach((v, i) => links[i] !== undefined ? v.link = links[i] : null);
            verifiers.forEach((v) => v.dgFileVerifiers = undefined); // undefined fields are skipped
            await getRepository(Verifier).save(verifiers);
            console.log('Finished updating verification links at ' + currentTime);
        } catch (err) {
            console.log('Failed to update verification links at ' + currentTime );
            console.log('Error: ', err);
        }
    };
};

const aggregateHashes = (files: DGFile[]): string => {
    const sameFileDelimiter = ',';
    const diffFileDelimiter = '|';
    const fileHashes = files.map((file) => file.plaintextHash + sameFileDelimiter + file.encryptedHash);
    return fileHashes.join(diffFileDelimiter);
};
