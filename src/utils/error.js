class BadRequestError extends Error {
  constructor(message = 'Bad Request') {
    super(message);
    this.status = 400;
  }
}

class ConflictError extends Error {
  constructor(message = 'Conflict') {
    super(message);
    this.status = 409;
  }
}

class UnprocessableEntityError extends Error {
  constructor(message = 'Unprocessable Entity') {
    super(message);
    this.status = 422;
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.status = 403;
  }
}

class NotFoundError extends Error {
  constructor(message = 'Not Found') {
    super(message);
    this.status = 404;
  }
}

module.exports = {
  BadRequestError,
  ConflictError,
  UnprocessableEntityError,
  ForbiddenError,
  NotFoundError,
};