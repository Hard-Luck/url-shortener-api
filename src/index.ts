import express from 'express';
import apiRouter from './routers/api';
import cors from 'cors';



const app = express();
app.use(cors());
app.use(express.json());
app.use('/', apiRouter);
app.get('/:url_id')
export default app;
