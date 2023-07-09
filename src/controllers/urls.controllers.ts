import { NextFunction, Request, Response } from 'express';
import { getAllUrls, insertNewUrl } from '../models/urls';
import { userFromRequest } from '../auth';

export async function getUrls(req: Request, res: Response, next: NextFunction) {
  try {
    const urls = await getAllUrls();
    res.status(200).send({ urls });
  } catch (error) {
    next(error);
  }
}

export async function postUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = userFromRequest(req);
    const originalUrl = req.body.url;
    const url = await insertNewUrl(originalUrl, id);
    res.status(201).send({ url });
  } catch (error) {
    next(error);
  }
}