import dotenv from "dotenv";
import path from "path";
import { logger } from "@/logging";
import ms, { StringValue } from "ms";

// Get current node environment
const env = process.env.NODE_ENV || "development";

// Configure env
const envFileName = `.env`;

const envPath = path.resolve(process.cwd(), envFileName).trim();

// Try loading the environment variables and check if there's an error
const result = dotenv.config({ path: envPath });

if (result.error) {
  logger.error("Error loading .env file:", result.error);
} else {
  logger.debug("Successfully loaded .env file:", envPath);
}

export const config = {
  port: Number.parseInt(process.env.PORT!) || 3000,
  env: process.env.ENV,
  hostname: process.env.HOST,
  baseUrl: process.env.BASE_URL || `http://127.0.0.1:${process.env.PORT}`,
  corsOrigins: (process.env.CORS_ORIGINS || "").split(","),
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY!,
    publicKey: process.env.JWT_PUBLIC_KEY!,
    expiresIn: ms(
      Number.parseInt(process.env.JWT_TTL || "86400000")
    ) as StringValue,
    ttl: Number.parseInt(process.env.JWT_TTL || "86400000"),
    issuer: process.env.ISSUER || "kannie-the-artist", // time in seconds
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  mail: {
    sender: process.env.MAIL_SENDER || "philipowolabi79@gmail.com",
    smtppass: process.env.MAIL_SMTPPASS,
  },
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  },
  isProduction: process.env.ENVIRONMENT === "production",
};
