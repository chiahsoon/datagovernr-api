import express = require('express');
import {body} from 'express-validator';
import {ReqValidationErrorHandler} from '../../middleware/reqValidationErrorHandler';
import {APIResponse} from '../../presentation/apiResponse';
import {NextFunction, Request, Response} from 'express';
import {DGFile} from '../../entity/DGFile';
import {getConnection} from 'typeorm';
import {InternalServerError} from '../../error/errors';


const router = express.Router();

router.post('/',
    body('files.*.id')
        .isString().withMessage('Invalid file id(s)')
        .notEmpty({ignore_whitespace: true}).withMessage('Missing or invalid file id(s)'),
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

export default router;
