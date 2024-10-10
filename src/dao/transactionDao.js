import Transactions from '../models/transaction.js';
import logger from '../../lib/logger.js';

const TransactionDao = {
  // 완료된 거래 기록
  async insert(params) {
    try {
      const inserted = await Transactions.create(params);
      console.log(inserted);
    } catch (error) {
      logger.error('insert new transaction error:', error);
      throw error;
    }
  },
};

// {
//   offererId: params.userId,
//   proposerId: '10',
//   contentsId: params.contentsId,
//   purpose: params.purpose,
// }

export default TransactionDao;
