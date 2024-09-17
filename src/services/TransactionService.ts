import { inject, injectable } from 'inversify';
import TransactionRepository from '../repositories/TransactionRepository';
import UserRepository from '../repositories/UserRepository';
import { BaseService } from './BaseService';
import Transaction, { TransactionAttributes, TransactionCreationAttributes } from '../models/transaction/Transaction';

@injectable()
class TransactionService extends BaseService<Transaction, TransactionAttributes, TransactionCreationAttributes> {
  constructor(
    @inject(TransactionRepository) private transactionRepository: TransactionRepository,
    @inject(UserRepository) private userRepository: UserRepository,
  ) {
    super(transactionRepository);
  }

  /**
   * Deposit money into a user's account.
   * @param userId - The ID of the user.
   * @param amount - The amount to deposit.
   * @returns A promise that resolves to the created transaction.
   */
  public async deposit(userId: number, amount: number): Promise<Transaction> {
    const user = await this.userRepository.findByPk(userId);
    if (!user) throw new Error('User not found');

    // Increase the balance
    user.balance += amount;
    await user.save();

    // Record the transaction
    const transaction: TransactionCreationAttributes = {
      user_id: userId,
      transaction_type: 'DEPOSIT',
      amount,
      description: null,
    };

    return this.transactionRepository.create(transaction);
  }

  /**
   * Withdraw money from a user's account.
   * @param userId - The ID of the user.
   * @param amount - The amount to withdraw.
   * @returns A promise that resolves to the created transaction.
   */
  public async withdraw(userId: number, amount: number): Promise<Transaction> {
    const user = await this.userRepository.findByPk(userId);
    if (!user) throw new Error('User not found');

    // Check if the user has enough balance
    if (user.balance < amount) throw new Error('Insufficient balance');

    // Decrease the balance
    user.balance -= amount;
    await user.save();

    // Record the transaction
    const transaction: TransactionCreationAttributes = {
      user_id: userId,
      transaction_type: 'WITHDRAWAL',
      amount,
      description: null,
    };

    return this.transactionRepository.create(transaction);
  }
}

export default TransactionService;