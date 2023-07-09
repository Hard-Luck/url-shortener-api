import express from 'express';
import { getUrls, getUserUrls, postUrl } from '../controllers/urls.controllers';

const urlsRouter = express.Router();

urlsRouter.route('/').get(getUrls).post(postUrl);
urlsRouter.route('/user').get(getUserUrls);
export default urlsRouter;
