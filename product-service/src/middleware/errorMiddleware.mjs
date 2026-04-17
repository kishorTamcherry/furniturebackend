import { ZodError } from 'zod';
import logger from '../config/logger.mjs';

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const errorMiddleware = (err, req, res, next) => {
  // Zod Validation Error Logging
  if (err instanceof ZodError || err.name === 'ZodError') {
    const issues = err.issues || err.errors || [];
    const summary = issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
    logger.error(`[Validation Error] ${summary}`);

    return res.status(400).json({
      error: 'Validation Failed',
      details: issues.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    logger.error(`[Duplicate Key Error] ${err.message}`);
    return res.status(400).json({
      error: 'Duplicate field value entered',
      details: Object.keys(err.keyValue).map(key => `${key} already exists`)
    });
  }

  // Default Error Handling & Logging
  logger.error(err); // Pino handles Error objects well
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error'
  });
};
