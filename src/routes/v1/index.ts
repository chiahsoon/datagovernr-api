import * as express from 'express';
import {NextFunction, Request, Response} from 'express';
import {APIResponse} from '../../presentation/apiResponse';
import DGFileRoutes from './dgFileRoutes';
import cronjobTestRoutes from './cronjobTestRoutes';

const router = express.Router();
router.use('/file', DGFileRoutes);
router.use('/test', cronjobTestRoutes);


router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
    res.status(200);
    res.send(new APIResponse('pong'));
});

export default router;
