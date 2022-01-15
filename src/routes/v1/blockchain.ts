import express = require('express');
import {NextFunction, Request, Response} from 'express';
import {APIResponse} from '../../presentation/apiResponse';
import {ethers, Wallet} from 'ethers';
import * as fs from 'fs';
import {BadRequest, InternalServerError} from '../../error/errors';

const DG_ADMIN_PRIVATE_KEY = process.env.DG_ADMIN_PRIVATE_KEY ||
    '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'; // Second mock account in Hardhat

const connectToDGContract = (): ethers.Contract => {
    const deploymentData = JSON.parse(fs.readFileSync(process.env.DG_ABI_FILEPATH).toString());
    const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER_URL);
    const signer = new Wallet(DG_ADMIN_PRIVATE_KEY, provider);
    return new ethers.Contract(process.env.DG_CONTRACT_ADDRESS, deploymentData.abi, signer);
};

const router = express.Router();

router.post('/add', async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.hash == null) {
        next(new BadRequest('Hash is missing'));
        return;
    }

    try {
        await connectToDGContract().add(req.body.hash);
    } catch (err) {
        console.log(err);
        next(new InternalServerError('Failed to add hash to DataGovernR contract'));
        return;
    }

    res.status(200);
    res.send(new APIResponse(null, {}));
});

router.get('/verify', async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.hash == null) {
        next(new BadRequest('Hash is missing'));
        return;
    }

    try {
        const verified = await connectToDGContract().verify(req.query.hash);
        res.status(200);
        res.send(new APIResponse(null, {verified}));
    } catch (err) {
        console.log(err);
        next(new InternalServerError('Failed to add hash to DataGovernR contract'));
        return;
    }
});


export default router;
