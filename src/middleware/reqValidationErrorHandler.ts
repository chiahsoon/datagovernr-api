import {NextFunction, Request, Response} from 'express';
import {validationResult} from 'express-validator';
import {BadRequest} from '../error/errors';

export const ReqValidationErrorHandler = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map((err) => err.msg).join('; ');
        next(new BadRequest('Invalid request: ' + messages));
        return;
    }
    next();
};
