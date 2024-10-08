import pointDao from '../dao/pointDao.js';

// 포인트 서비스
const pointService = {
  // 포인트 추가 서비스
  async addPoints(params) {
    let inserted = null;
    try {
      inserted = await pointDao.addPoints(params);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(inserted);
    });
  },

  async deductPoints(params) {
    let deducted = null;

    try {
      deducted = await pointDao.deductPoints(params);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(deducted);
    });
  },

  // 주간 포인트 리셋 서비스
  async resetWeeklyPoints() {
    return await pointDao.resetWeeklyPoints();
  },

  // 주간 랭킹 조회 서비스
  async getWeeklyRankings() {
    const { weeklyRanking } = await pointDao.getTopRankings();
    return weeklyRanking;
  },

  // 누적 랭킹 조회 서비스
  async getTotalRankings() {
    const { totalRanking } = await pointDao.getTopRankings();
    return totalRanking;
  },
};

export default pointService;
