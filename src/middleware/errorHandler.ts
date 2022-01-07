import {NextFunction, Request, Response} from 'express';
import {BaseError} from '../error/errors';
import {APIResponse} from '../presentation/APIResponse';

export function CustomErrorHandler(err: BaseError, req: Request, res: Response, next: NextFunction) {
    const apiResponse: APIResponse = new APIResponse(err.message, null);
    res.status(err.statusCode != undefined ? err.statusCode : 500);
    res.send(apiResponse);
}
