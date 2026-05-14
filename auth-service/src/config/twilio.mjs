import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.warn('Twilio credentials not configured. OTP SMS will be logged instead of sent.');
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;

export default client;
