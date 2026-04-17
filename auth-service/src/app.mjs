import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.mjs';
import { errorMiddleware } from './middleware/errorMiddleware.mjs';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

export default app;
