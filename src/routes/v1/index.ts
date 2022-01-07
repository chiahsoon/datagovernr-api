import express = require('express');
import {NextFunction, Request, Response} from 'express';
import {APIResponse} from '../../presentation/apiResponse';

const router = express.Router();
router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
    res.status(200);
    res.send(new APIResponse('pong'));
});

export default router;
