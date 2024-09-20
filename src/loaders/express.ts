import express from 'express';
import config from '../config/config';
import routes from '../api';
import { errorHandler } from '../middleware/ErrorHandler';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import { apiLimiter } from '../middleware/RateLimiter';
import cors from 'cors';

export default ({ app }: { app: express.Application }) => {
  /**
   * Health Check endpoints
   * @TODO Explain why they are here

  app.get("/status", (req, res) => {
    res.status(200).end();
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  */
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Transforms the raw string of req.body into json
  app.use(express.json());
  if (config.env === 'development') {
    app.use(morgan('dev'));
  }
  app.use(compression());
  app.use(helmet());
  // Apply rate limiting to all routes
  app.use(apiLimiter);
  // Load API routes
  app.use(config.api.prefix, routes());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Global error handler
  app.use(errorHandler);
};
