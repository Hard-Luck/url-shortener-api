import { NextFunction, Request, Response } from 'express';
import {
  deleteUrlById,
  getAllUrls,
  getUrlsByUserId,
  insertNewUrl,
  redirect,
  updateUrl,
} from '../models/urls';
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
    const alias = req.body.alias;
    const url = await insertNewUrl(originalUrl, alias, id);
    res.status(201).send({ url });
  } catch (error) {
    next(error);
  }
}

export async function redirectToOriginalUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { url_id } = req.params;
    const url = await redirect(url_id);
    if (url) {
      res.redirect(url.originalUrl);
    } else {
      res.status(404).send({ message: 'Not Found' });
    }
  } catch (error) {
    next(error);
  }
}

export async function getUserUrls(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = userFromRequest(req);
    const urls = await getUrlsByUserId(id);
    res.status(200).send({ urls });
  } catch (error) {
    next(error);
  }
}

export async function deleteUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = userFromRequest(req);
    const { url_id } = req.params;
    await deleteUrlById(url_id, id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function patchUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id: userId } = userFromRequest(req);
    const { url_id } = req.params;
    const { isActive, alias } = req.body;
    const url = await updateUrl(url_id, userId, isActive, alias);
    res.status(200).send({ url });
  } catch (error) {
    next(error);
  }
}
