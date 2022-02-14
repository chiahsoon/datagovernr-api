import {Router, Request, Response, NextFunction} from 'express';
import {getRepository} from 'typeorm';
import {DGFileVerifier} from '../../entity/DGFileVerifier';
import {getTimestampAllFn, getUpdateVerificationLinkFn} from '../../job/timestamp';
import {APIResponse} from '../../presentation/apiResponse';
import {MockStamp} from '../../services/timestamper/mockstamp';

// For testing of cronjobs only

const router = Router();

router.get('/add_timestamp', async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = '123';
    const timestampService = new MockStamp(apiKey);
    getTimestampAllFn(timestampService)();
    res.status(200);
    res.send(new APIResponse(null, 'success'));
});

router.get('/update_timestamp', async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = '123';
    const timestampService = new MockStamp(apiKey);
    getUpdateVerificationLinkFn(timestampService)();
    res.status(200);
    res.send(new APIResponse(null, 'success'));
});

router.get('/clear', async (req: Request, res: Response, next: NextFunction) => {
    await getRepository(DGFileVerifier).query('DELETE FROM "dg_file_verifier"');
    await getRepository(DGFileVerifier).query('DELETE FROM "verifier"');
    res.status(200);
    res.send(new APIResponse(null, 'success'));
});

export default router;
