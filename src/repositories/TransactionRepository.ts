import Transaction, { TransactionAttributes, TransactionCreationAttributes } from '../models//transaction/Transaction'; // Transaction model
import { GenericRepository } from './generic/GenericRepository';
import { injectable } from 'inversify';

@injectable()
class TransactionRepository extends GenericRepository<Transaction, TransactionAttributes, TransactionCreationAttributes> {
  constructor() {
    super(Transaction);
  }
  
  // Find transactions by user ID
  public async findByUserId(userId: number): Promise<Transaction[]> {
    return await this.model.findAll({ where: { user_id: userId } });
  }
}

export default TransactionRepository;
