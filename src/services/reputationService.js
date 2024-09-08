import userDao from '../dao/userDao.js';
// import logger from '../../lib/logger.js';

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
};

export default reputationService;
