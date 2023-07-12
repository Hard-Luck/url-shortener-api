import express from 'express';
import {
  deleteUrl,
  getUrls,
  getUserUrls,
  patchUrl,
  postUrl,
} from '../controllers/urls.controllers';

const urlsRouter = express.Router();

urlsRouter.route('/').get(getUrls).post(postUrl);
urlsRouter.route('/user').get(getUserUrls);
urlsRouter.route('/:url_id').patch(patchUrl).delete(deleteUrl);
export default urlsRouter;
