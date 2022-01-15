import express = require('express');
import {NextFunction, Request, Response} from 'express';
import {APIResponse} from '../../presentation/apiResponse';
import BlockchainRoutes from './blockchain';

const router = express.Router();
router.use('/blockchain', BlockchainRoutes);

router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
    res.status(200);
    res.send(new APIResponse('pong'));
});

export default router;
