import express from 'express';
import usersRouter from './users';
import { isAuthorised, login } from '../auth';
import urlsRouter from './urls';

const v1Router = express.Router();

v1Router.post('/login', login);
v1Router.use(isAuthorised);

v1Router.use('/users', usersRouter);
v1Router.use('/urls', urlsRouter);
v1Router.get('/protected', (req, res) => {
  res.send({ msg: 'If you see this message, you are logged in' });
});

export default v1Router;
