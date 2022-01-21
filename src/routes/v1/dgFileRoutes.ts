import express = require('express');
import {body, query} from 'express-validator';
import {ReqValidationErrorHandler} from '../../middleware/reqValidationErrorHandler';
import {APIResponse} from '../../presentation/apiResponse';
import {NextFunction, Request, Response} from 'express';
import {DGFile} from '../../entity/DGFile';
import {getConnection} from 'typeorm';
import {InternalServerError} from '../../error/errors';
import {DGFileVerifier} from '../../entity/DGFileVerifier';
import {VerificationDetails} from '../../presentation/verificationDetails';


const router = express.Router();

router.post('/',
    body('files.*.id')
        .isString().withMessage('Invalid file id(s)')
        .notEmpty({ignore_whitespace: true}).withMessage('Missing file id(s)'),
    body('files.*.encryptedHash')
        .isString().withMessage('Invalid encryptedHash(es)')
        .notEmpty({ignore_whitespace: true}).withMessage('Missing encryptedHash(es)'),
    ReqValidationErrorHandler, async (req: Request, res: Response, next: NextFunction) => {
        const dgFiles: DGFile[] = req.body.files;
        try {
            const repo = getConnection().getRepository(DGFile);
            const savedDgFiles = await repo.save(dgFiles);
            res.status(200);
            res.send(new APIResponse(null, savedDgFiles));
        } catch (err) {
            console.log('Error: ', err);
            next(new InternalServerError('Failed to save all tasks'));
            return;
        }
    });

router.get('/verify',
    query('fileId')
        .notEmpty({ignore_whitespace: true}).withMessage('Missing file id'),
    ReqValidationErrorHandler, async (req: Request, res: Response, next: NextFunction) => {
        const fileId = req.query.fileId;
        try {
            const repo = getConnection().getRepository(DGFileVerifier);
            const fileVerifier = await repo.findOne({
                where: {dgFileId: fileId},
                relations: ['verifier'],
            });
            const verifier = fileVerifier.verifier;

            const allInvolvedVerifiers = await repo.find({
                where: {verifierId: verifier.id},
                relations: ['dgFile'],
            });
            const files = allInvolvedVerifiers.map((v) => v.dgFile);

            const resp: VerificationDetails = {verifier, files};
            res.status(200);
            res.send(new APIResponse(null, resp));
        } catch (err) {
            console.log('Error: ', err);
            next(new InternalServerError('Failed to retrieve verification details'));
            return;
        }
    });

export default router;
