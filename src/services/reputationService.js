import userDao from '../dao/userDao.js';
import logger from '../../lib/logger.js';

const reputationService = {
  async processLike(params) {
    const user = await userDao.getUserById(params);
    if (!user) {
      throw new Error('User Not found');
    }

    const newScore = user.reputationScore + 1;
    const newParams = {
      ...params,
      reputationScore: newScore,
    };
    return await userDao.updateUserReputation(newParams);
  },
  async processDisLike(params) {
    const user = await userDao.getUserById(params);
    if (!user) {
      throw new Error('User Not found');
    }
    const newScore = user.reputationScore - 1;
    const newParams = {
      ...params,
      reputationScore: newScore,
    };
    return await userDao.updateUserReputation(newParams);
  },
  async updateReputation(params) {
    try {
      const user = await userDao.getUserById(params);
      if (!user) {
        throw new Error('User Not Found');
      }
      const newScore = user.reputationScore + params.reputationScore;
      const newParams = {
        ...params,
        reputationScore: newScore,
      };
      return await userDao.updateUserReputation(newParams);
    } catch (error) {
      logger.error('update User Reputation Error:', error);
      throw error;
    }
  },
};

export default reputationService;
