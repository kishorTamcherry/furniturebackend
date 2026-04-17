import './src/config/env.mjs';
import connectDB from './src/config/db.mjs';
import app from './src/app.mjs';
import logger from './src/config/logger.mjs';

const start = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    logger.info(`Product Service running on port ${PORT}`);
  });
};

start();
