import dotenv from 'dotenv';

dotenv.config();

export const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

if (!googleMapsApiKey) {
  throw new Error(
    'Google Maps API key is not set in the environment variables. API 키 확인 부탁드립니다.'
  );
}
