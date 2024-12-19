import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    dotenv.config();
  } else {
    console.warn('\x1b[33m%s\x1b[0m', 'Warning: .env file not found, but ignoring in production environment.');
  }
}

initializeEnv();

export const loadEnvConfig = () => {
  try {
    // Ensure private key is properly formatted with actual newlines
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    const config = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      universe_domain: 'googleapis.com'
    };

    // Validate required fields
    const requiredFields = [
      'type',
      'project_id',
      'private_key_id',
      'private_key',
      'client_email',
      'client_id'
    ];

    const missingFields = requiredFields.filter(field => !config[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
    }

    // Log configuration status
    console.log('\nFirebase Configuration Status:');
    return config;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Error loading environment configuration:', error.message);
    throw error;
  }
};