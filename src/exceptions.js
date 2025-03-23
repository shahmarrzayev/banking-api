function BadRequestException(message) {
    Error.captureStackTrace(this, this.constructor);
    this.title = 'Bad request';
    this.code = 400;
    this.message = message || 'Bad request';
}

function ClientException(errors) {
    Error.captureStackTrace(this, this.constructor);
    this.title = errors[0].title || 'Internal server error';
    this.code = errors[0].status || 500;
    this.message = errors[0].detail || 'Internal server error';
}

function ConflictException(message) {
    Error.captureStackTrace(this, this.constructor);
    this.title = 'Conflict';
    this.code = 409;
    this.message = message || 'Already exists';
}

function ForbiddenException(message) {
    Error.captureStackTrace(this, this.constructor);
    this.title = 'Forbidden';
    this.code = 403;
    this.message = message || 'Forbidden';
}

function GeneralException(message) {
    Error.captureStackTrace(this, this.constructor);
    this.title = 'Internal server error';
    this.code = 500;
    this.message = message || 'Internal server error';
}

function NotFoundException(message) {
    Error.captureStackTrace(this, this.constructor);
    this.title = 'Not found';
    this.code = 404;
    this.message = message || 'Not found';
}

function UnauthorizedException(message) {
    Error.captureStackTrace(this, this.constructor);
    this.title = 'Unauthorized';
    this.code = 401;
    this.message = message || 'Unauthorized';
}

module.exports = {
    BadRequestException,
    ClientException,
    ConflictException,
    ForbiddenException,
    GeneralException,
    NotFoundException,
    UnauthorizedException,
};
