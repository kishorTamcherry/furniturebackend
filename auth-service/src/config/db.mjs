import mongoose from 'mongoose';
import logger from './logger.mjs';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('Connected to MongoDB (Auth)');
  } catch (err) {
    logger.error(`MongoDB connection error (Auth): ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
