import { NextFunction, Request, Response } from 'express';
import { addUser } from '../models/users';

export async function postUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, username, password } = req.body;
    const user = await addUser(email, username, password);
    res.status(201).send({ user });
  } catch (error) {
    next(error);
  }
}
