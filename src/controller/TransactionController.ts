import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/AsyncHandler';
import TransactionService from '../services/TransactionService';
import { inject, injectable } from 'inversify';
import { success, error } from '../middleware/ResponseHandler';
import { TransactionCreationAttributes } from '../models/transaction/Transaction';

@injectable()
export class TransactionController {
  constructor(@inject(TransactionService) private transactionService: TransactionService) {}

  /**
   * Handle deposit transactions.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the transaction details.
   * @example POST /v1/transaction/deposit/1
   */
  public deposit = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }
    const data: TransactionCreationAttributes = req.body;
    if (typeof data.amount !== 'number' || data.amount <= 0) {
      return error(res, 400, 'INVALID_AMOUNT', 'Amount must be a positive number');
    }
    const transaction = await this.transactionService.deposit(userId,data);
    return success(res, 200, transaction);
  });

  /**
   * Handle withdrawal transactions.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the transaction details.
   * @example POST /v1/transaction/withdraw/1
   */
  public withdraw = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }
    const { amount } = req.body;
    if (typeof amount !== 'number' || amount <= 0) {
      return error(res, 400, 'INVALID_AMOUNT', 'Amount must be a positive number');
    }
    const transaction = await this.transactionService.withdraw(userId, amount);
    return success(res, 200, transaction);
  });
}
