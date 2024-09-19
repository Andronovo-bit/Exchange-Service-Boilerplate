import express from 'express';
import config from '../config/config';
import routes from '../api';
import { errorHandler } from '../middleware/ErrorHandler';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import { apiLimiter } from '../middleware/RateLimiter';

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

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  //app.use(cors());

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
