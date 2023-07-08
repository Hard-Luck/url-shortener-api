import express, { Request, Response } from 'express';
import { isAuthorised, login } from './auth';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Shorten your URLs!');
});
app.post('/v1/login', login);

app.use(isAuthorised)
app.get('/protected', (req: Request, res: Response) => {
  res.send('You are authorized!');
})
export default app;
