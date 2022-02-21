import * as express from 'express';
import {NextFunction, Request, Response} from 'express';
import {APIResponse} from '../../presentation/apiResponse';
import DGFileRoutes from './dgFileRoutes';
import VerifierRoutes from './verifierRoutes';

const router = express.Router();
router.use('/file', DGFileRoutes);
router.use('/verify', VerifierRoutes);


router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
    res.status(200);
    res.send(new APIResponse('pong'));
});

export default router;
