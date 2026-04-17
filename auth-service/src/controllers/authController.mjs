import * as authService from '../services/authService.mjs';
import { asyncHandler } from '../middleware/errorMiddleware.mjs';

export const register = asyncHandler(async (req, res) => {
  await authService.registerUser(req.body);
  res.status(201).json({ message: 'User registered successfully' });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.json(result);
});
