import express from 'express';
import apiRouter from './routers/api';

const app = express();
app.use(express.json());

app.use('/', apiRouter);

export default app;
