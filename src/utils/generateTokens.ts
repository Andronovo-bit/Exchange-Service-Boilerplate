import jwt from 'jsonwebtoken';
import config from '../config/config';

const tokenCache: { [key: string]: { token: string, expiresAt: number } } = {};

export const generateToken = (userId: string | number): string => {
  if (!config.jwt.secret) {
    throw new Error('JWT secret is not defined');
  }

  const cacheKey = `accessToken:${userId}`;
  const cachedEntry = tokenCache[cacheKey];

  // Check if the token is cached and not expired
  if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
    return cachedEntry.token;
  }

  // Generate a new token
  const token = jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiration,
  });

  // Cache the token with an expiration time of 1 day (86400 seconds)
  tokenCache[cacheKey] = {
    token,
    expiresAt: Date.now() + 86400 * 1000, // 1 day in milliseconds
  };

  return token;
};