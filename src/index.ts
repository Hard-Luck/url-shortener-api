import express from 'express';
import apiRouter from './routers/api';
import { redirectToOriginalUrl } from './controllers/urls.controllers';
import cors from 'cors';
import { handle500s, handleCustomErrors } from './controllers/errors';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/', apiRouter);
app.get('/:url_id', redirectToOriginalUrl);

app.use(handleCustomErrors);
app.use(handle500s);
export default app;
