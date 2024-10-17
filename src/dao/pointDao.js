// sequelize와 User 모델 불러오기
import Point from '../models/point.js';

// 포인트 관련 DAO
const PointDao = {
  // 사용자 ID로 포인트 찾기
  async findByUserId(userId) {
    return await Point.findOne({ where: { userId } });
  },

  // 주간 포인트 리셋
  async resetWeeklyPoints() {
    const currentWeek = new Date().getWeek();
    return await Point.update(
      { weeklyPoints: 0, lastUpdatedWeek: currentWeek },
      { where: {} }
    );
  },

  // 포인트 추가
  async addPoints(params) {
    const point = await this.findByUserId(params.userId);
    const currentWeek = new Date().getWeek();

    if (point.lastUpdatedWeek !== currentWeek) {
      point.weeklyPoints = 0;
      point.lastUpdatedWeek = currentWeek;
    }

    // pointsToAdd와 포인트 필드들을 정수형으로 변환 후 합산
    const pointsToAddInt = Number(params.pointsToAdd); // 또는 parseInt(pointsToAdd, 10)

    point.weeklyPoints += pointsToAddInt;
    point.totalPoints += pointsToAddInt;

    return await point.save();
  },

  // 포인트 차감 (주간 포인트는 차감하지 않음)
  async deductPoints(params) {
    const point = await this.findByUserId(params.userId);
    const pointsToDeductInt = Number(params.pointsToDeduct); // 또는 parseInt(pointsToDeduct, 10)

    // 포인트가 충분한지 확인
    if (point.totalPoints < pointsToDeductInt) {
      throw new Error('차감할 포인트가 부족합니다.');
    }

    // 누적 포인트에서만 차감 (주간 포인트는 유지)
    point.totalPoints -= pointsToDeductInt;

    return await point.save();
  },

  // 주간 및 누적 랭킹 조회
  async getTopRankings() {
    const weeklyRanking = await Point.findAll({
      order: [['weeklyPoints', 'DESC']],
      limit: 10,
    });

    const totalRanking = await Point.findAll({
      order: [['totalPoints', 'DESC']],
      limit: 10,
    });

    return { weeklyRanking, totalRanking };
  },
};

export default PointDao;