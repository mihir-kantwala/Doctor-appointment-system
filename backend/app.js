import express from 'express';
import cors from 'cors';

import doctorRoute from './routes/doctorRoutes.js';
import { logger } from './middlewares/logger.js';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

app.use(logger);
app.use('/api', doctorRoute);

export default app;
