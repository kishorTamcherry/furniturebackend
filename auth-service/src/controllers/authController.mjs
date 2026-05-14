import jwt from 'jsonwebtoken';
import * as authService from '../services/authService.mjs';
import * as otpService from '../services/otpService.mjs';
import User from '../models/User.mjs';
import redis from '../config/redis.mjs';
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

export const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  await otpService.generateAndSendOtp(phone);
  res.json({ message: 'OTP sent successfully' });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  const isValid = await otpService.verifyOtp(phone, otp);
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  // Auto-register if phone is new, otherwise login
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone });
  }

  const token = jwt.sign(
    { id: user._id, phone: user.phone },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  await redis.set(`sess:${user._id}`, token, 'EX', 3600);

  res.json({ token, user: { id: user._id, phone: user.phone } });
});
