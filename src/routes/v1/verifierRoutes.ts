import {NextFunction, Request, Response, Router} from 'express';
import {query} from 'express-validator';
import {getRepository} from 'typeorm';
import {Verifier} from '../../entity/Verifier';
import {InternalServerError} from '../../error/errors';
import {ReqValidationErrorHandler} from '../../middleware/reqValidationErrorHandler';
import filetype from 'magic-bytes.js';
import * as stream from 'stream';

const router = Router();

router.get('/data',
    query('id')
        .notEmpty({ignore_whitespace: true}).withMessage('Missing verifier id'),
    ReqValidationErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        const verifierId = parseInt(req.query.verifierId == null ? '' : req.query.verifierId.toString());
        try {
            const repo = getRepository(Verifier);
            const verifier = await repo.findOne({
                where: {id: verifierId},
            });

            if (verifier == null || verifier.data == null) {
                throw new Error('Proof data not found');
            }

            let ext = '';
            const fileType = filetype(verifier.data);
            if (fileType.length > 0 && fileType[0].extension) {
                ext = fileType[0].extension;
            }

            const readStream = new stream.PassThrough();
            readStream.end(verifier.data);
            res.set('Content-disposition', `attachment; filename=proof${ext}`);
            res.set('Content-Type', 'application/octet-stream');
            readStream.pipe(res);
        } catch (err) {
            console.log('Error: ', err);
            next(new InternalServerError('Failed to retrieve verification details'));
            return;
        }
    });

export default router;
