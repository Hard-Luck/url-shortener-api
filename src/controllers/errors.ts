import { Request, Response, NextFunction } from 'express';

type CustomError = { status: number; message: string };

function isCustomError(err: unknown): err is CustomError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    'message' in err &&
    Object.keys(err).length === 2
  );
}
export const handleCustomErrors = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (isCustomError(err)) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

export const handle500s = (err: unknown, req: Request, res: Response): void => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
