import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/config';
import { error } from './ResponseHandler';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: string;
    }
  }
}

/**
 * Middleware to authenticate JWT and attach the user ID to the request object.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 * @returns Response with error message if authentication fails, otherwise calls next()
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 401, 'UNAUTHORIZED', 'No token provided');
  }

  const token = authHeader.split(' ')[1];

  if (!config.jwt.secret) {
    return error(res, 500, 'SERVER_ERROR', 'JWT secret is not defined');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    if (req.params.userId && req.params.userId != decoded.userId) {
      return error(res, 401, 'UNAUTHORIZED', 'Invalid token');
    }

    req.user = decoded.userId;
    next();
  } catch (err: any) {
    return error(res, 401, 'UNAUTHORIZED', 'Invalid token');
  }
};

/**
 * Middleware to authenticate JWT without attaching the user ID to the request object.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 * @returns Response with error message if authentication fails, otherwise calls next()
 */
export const authenticateJWTNoUser = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 401, 'UNAUTHORIZED', 'No token provided');
  }

  const token = authHeader.split(' ')[1];

  if (!config.jwt.secret) {
    return error(res, 500, 'SERVER_ERROR', 'JWT secret is not defined');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    if (!decoded) {
      return error(res, 401, 'UNAUTHORIZED', 'Invalid token');
    }
    next();
  } catch (err: any) {
    return error(res, 401, 'UNAUTHORIZED', 'Invalid token');
  }
};