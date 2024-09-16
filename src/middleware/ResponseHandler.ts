import { Response } from 'express';

export const success = (res: Response, status: number, data: any, message?: string) => {
  return res.status(status).json({
    statusText: 'OK',
    message: message,
    status: status,
    data,
  });
};

export const error = (res: Response, status: number, errorCode: string, message: string) => {
  return res.status(status).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
    },
  });
};
