import twilioClient, { TWILIO_PHONE } from '../config/twilio.mjs';
import redis from '../config/redis.mjs';
import logger from '../config/logger.mjs';

const OTP_PREFIX = 'otp:';
const OTP_TTL = 300; // 5 minutes

export const generateAndSendOtp = async (phone) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Always store OTP in Redis first — regardless of Twilio success/failure
  await redis.set(`${OTP_PREFIX}${phone}`, otp, 'EX', OTP_TTL);

  if (!twilioClient || !TWILIO_PHONE) {
    logger.info(`[DEV] OTP for ${phone}: ${otp}`);
    return;
  }

  try {
    await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      from: TWILIO_PHONE,
      to: phone
    });
    logger.info(`OTP sent to ${phone}`);
  } catch (err) {
    logger.warn(`Twilio send failed (${err.message}), but OTP is stored. Check console log.`);
    logger.info(`[DEV] OTP for ${phone}: ${otp}`);
  }
};

export const verifyOtp = async (phone, otp) => {
  const storedOtp = await redis.get(`${OTP_PREFIX}${phone}`);
  if (!storedOtp || storedOtp !== otp) {
    return false;
  }
  await redis.del(`${OTP_PREFIX}${phone}`);
  return true;
};
