import express from 'express';
import { getUrls, postUrl } from '../controllers/urls.controllers';

const urlsRouter = express.Router();

urlsRouter.route('/').get(getUrls).post(postUrl);

export default urlsRouter;
