import express from 'express';
import * as authController from '../controllers/authController.mjs';
import authMiddleware from '../middleware/auth.mjs';
import { validate } from '../middleware/validateMiddleware.mjs';
import { registerSchema, loginSchema, phoneSchema, otpSchema, updateProfileSchema } from '../validation/authSchema.mjs';

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/send-otp', validate(phoneSchema), authController.sendOtp);
router.post('/verify-otp', validate(otpSchema), authController.verifyOtp);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, validate(updateProfileSchema), authController.updateProfile);

export default router;
