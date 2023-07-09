import { NextFunction, Request, Response } from 'express';
import { getAllUrls, getUrlById, insertNewUrl } from '../models/urls';
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

export async function redirectToOriginalUrl(req: Request, res: Response, next: NextFunction) {
  const { url_id } = req.params;
  const url = await getUrlById(url_id)
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send({ message: 'Url not found' });
  }
}