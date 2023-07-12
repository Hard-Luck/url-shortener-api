import express from 'express';
import { postUser } from '../controllers/users.controllers';

const usersRouter = express.Router();
usersRouter.route('/').post(postUser);
export default usersRouter;
