import express, { Request, Response } from 'express';
import v1Router from './v1';

const apiRouter = express.Router();

apiRouter.get('/', (req: Request, res: Response) => {
  res.send('Shorten your URLs!');
});
apiRouter.use('/v1', v1Router);
export default apiRouter;
