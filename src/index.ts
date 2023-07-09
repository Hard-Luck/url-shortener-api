import express from 'express';
import apiRouter from './routers/api';
import { redirectToOriginalUrl } from './controllers/urls.controllers';

const app = express();
app.use(express.json());

app.use('/', apiRouter);
app.get('/:url_id', redirectToOriginalUrl)

export default app;
