import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';
import redis from '../config/redis.mjs';

export const registerUser = async (userData) => {
  const { email, password, name } = userData;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  const user = new User({ email, password, name });
  return await user.save();
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  await redis.set(`sess:${user._id}`, token, 'EX', 3600);

  return { token, user: { id: user._id, email: user.email, name: user.name } };
};
