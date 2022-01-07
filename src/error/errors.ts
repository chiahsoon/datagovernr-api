export class BaseError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class BadRequest extends BaseError {
    constructor(message: string) {
        super(400, message);
    }
}

export class Unauthorized extends BaseError {
    constructor(message: string) {
        super(401, message);
    }
}

export class InternalServerError extends BaseError {
    constructor(message: string) {
        super(500, message);
    }
}
