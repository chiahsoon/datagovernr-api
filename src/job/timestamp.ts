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
            console.log('Involved files: ', files.map((f) => f.id));

            if (files.length == 0) {
                console.log('No files to verify at %s', currentTime.toString());
                return;
            }

            const hashConcat = aggregateHashes(files);
            await timestamper.addTimestamp(hashConcat);
            const newVerifier = await getRepository(Verifier).save(new Verifier());
            const newFileVerifiers = files.map((file) => new DGFileVerifier(file.id, newVerifier.id));
            await getRepository(DGFileVerifier).save(newFileVerifiers);

            console.log('Submitted hash at %s: %s', currentTime.toString(), hashConcat);
        } catch (err) {
            console.log('Failed to submit hash at %s:%s' + currentTime.toString(), err.toString());
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
            console.log('Involved verifiers: ', verifiers.map((v) => v.id));

            const fileVerifiers = verifiers.map((v) => v.dgFileVerifiers);
            const verifierFiles = fileVerifiers.map((v) => v.map((fv) => fv.dgFile));
            const hashes = verifierFiles.map((files) => aggregateHashes(files));
            const bufs = await timestamper.getVerificationAsData(hashes);

            // @ts-ignore - skip saving dgFileVerifiers fields
            verifiers.forEach((v) => v.dgFileVerifiers = undefined);
            verifiers.forEach((v, i) => bufs[i] != null ? v.link = `api://verifier/data?id=${v.id}` : null);
            verifiers.forEach((v, i) => v.data = bufs[i]);
            await getRepository(Verifier).save(verifiers);
            console.log('Finished updating verification links at %s', currentTime.toString());
        } catch (err) {
            console.log('Failed to update verification links at %s', currentTime.toString());
        }
    };
};

const aggregateHashes = (files: DGFile[]): string => {
    const sameFileDelimiter = ',';
    const diffFileDelimiter = '|';
    const fileHashes = files.map((file) => file.plaintextHash + sameFileDelimiter + file.encryptedHash);
    return fileHashes.join(diffFileDelimiter);
};
