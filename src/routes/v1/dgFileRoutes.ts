import {Router} from 'express';
import {body, query} from 'express-validator';
import {ReqValidationErrorHandler} from '../../middleware/reqValidationErrorHandler';
import {APIResponse} from '../../presentation/apiResponse';
import {NextFunction, Request, Response} from 'express';
import {DGFile} from '../../entity/DGFile';
import {getRepository} from 'typeorm';
import {InternalServerError} from '../../error/errors';
import {DGFileVerifier} from '../../entity/DGFileVerifier';
import {VerificationDetails} from '../../presentation/verificationDetails';

const router = Router();

router.post('/',
    body('files.*.id')
        .exists().withMessage('Missing file id(s)')
        .isNumeric().withMessage('Invalid file id(s)'),
    body('files.*.encryptedHash')
        .isString().withMessage('Invalid encryptedHash(es)')
        .notEmpty({ignore_whitespace: true}).withMessage('Missing encryptedHash(es)'),
    body('files.*.plaintextHash')
        .isString().withMessage('Invalid plaintextHash(es)')
        .notEmpty({ignore_whitespace: true}).withMessage('Missing plaintextHash(es)'),
    body('files.*.salt')
        .isString().withMessage('Invalid salt(s)')
        .notEmpty({ignore_whitespace: true}).withMessage('Missing salt(s)'),
    ReqValidationErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        const dgFiles: DGFile[] = req.body.files;
        try {
            const repo = getRepository(DGFile);
            const savedDgFiles = await repo.save(dgFiles);
            res.status(200);
            res.send(new APIResponse(undefined, savedDgFiles));
        } catch (err) {
            console.log('Error: ', err);
            next(new InternalServerError('Failed to save all tasks'));
            return;
        }
    });

router.get('/verify',
    query('fileId')
        .notEmpty({ignore_whitespace: true}).withMessage('Missing file id'),
    ReqValidationErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        const fileId = parseInt(req.query.fileId === undefined ? '' : req.query.fileId.toString());
        const resp: VerificationDetails = {verifier: undefined, files: []};

        try {
            const repo = getRepository(DGFileVerifier);
            const fileVerifiers = await repo.find({
                where: {dgFileId: fileId},
                relations: ['verifier'],
            });

            if (fileVerifiers.length > 0) {
                resp.verifier = fileVerifiers[0].verifier;
                const allInvolvedVerifiers = await repo.find({
                    where: {verifierId: resp.verifier.id},
                    relations: ['dgFile'],
                });
                resp.files = allInvolvedVerifiers.map((v) => v.dgFile);
            }

            res.status(200);
            res.send(new APIResponse(undefined, resp));
        } catch (err) {
            console.log('Error: ', err);
            next(new InternalServerError('Failed to retrieve verification details'));
            return;
        }
    });

export default router;
