import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.mjs';
import { errorMiddleware } from './middleware/errorMiddleware.mjs';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/api/products', productRoutes);

app.use(errorMiddleware);

export default app;
