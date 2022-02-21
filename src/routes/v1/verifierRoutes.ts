import {NextFunction, Request, Response, Router} from 'express';
import {query} from 'express-validator';
import {getRepository} from 'typeorm';
import {Verifier} from '../../entity/Verifier';
import {InternalServerError} from '../../error/errors';
import {ReqValidationErrorHandler} from '../../middleware/reqValidationErrorHandler';
import filetype from 'magic-bytes.js';
import * as stream from 'stream';
import {OriginStamp, BlockchainCurrency} from '../../services/timestamper/originstamp';
import {getTimestampAllFn, getUpdateVerificationLinkFn} from '../../job/timestamp';
import {APIResponse} from '../../presentation/apiResponse';

const router = Router();

router.get('/data',
    query('id')
        .notEmpty({ignore_whitespace: true}).withMessage('Missing verifier id'),
    ReqValidationErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        const verifierId = parseInt(req.query.id == null ? '' : req.query.id.toString());
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
                ext = '.' + fileType[0].extension;
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

// Manually trigger cronjob of creating verifiers
router.post('/',
    query('currency')
        .notEmpty({ignore_whitespace: true}).withMessage('Missing verifier currency'),
    ReqValidationErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let currency = BlockchainCurrency.ETH;
            if (req.query.currency != null) {
                currency = parseInt(req.query.currency.toString());
            }
            const apiKey = process.env.ORIGINSTAMP_API_KEY || '';
            const timestampService = new OriginStamp(apiKey, currency);
            getTimestampAllFn(timestampService)();
            res.status(200);
            res.send(new APIResponse(undefined, 'Successfully (force) ran timestamp cronjob'));
        } catch (err) {
            console.log('Error: ', err);
            next(new InternalServerError('Failed to add timestamps'));
            return;
        }
    });

// Manually trigger cronjob of updating verifiers
router.patch('/',
    query('currency')
        .notEmpty({ignore_whitespace: true}).withMessage('Missing verifier currency'),
    ReqValidationErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let currency = BlockchainCurrency.ETH;
            if (req.query.currency != null) {
                currency = parseInt(req.query.currency.toString());
            }
            const apiKey = process.env.ORIGINSTAMP_API_KEY || '';
            const timestampService = new OriginStamp(apiKey, currency);
            getUpdateVerificationLinkFn(timestampService)();
            res.status(200);
            res.send(new APIResponse(undefined, 'Successfully (force) ran update verification cronjob'));
        } catch (err) {
            console.log('Error: ', err);
            next(new InternalServerError('Failed to verify timestamps'));
            return;
        }
    });

export default router;
