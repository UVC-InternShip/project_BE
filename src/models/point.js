// ISO 8601 기준으로 주차 계산하는 함수
Date.prototype.getWeek = function () {
  const onejan = new Date(this.getFullYear(), 0, 1);
  const millisecsInDay = 86400000;
  return Math.ceil(
    ((this - onejan) / millisecsInDay + onejan.getDay() + 1) / 7
  );
};

// 모델 수정
import { Sequelize } from 'sequelize';

class Point extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        pointId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        weeklyPoints: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        totalPoints: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        lastUpdatedWeek: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: () => new Date().getWeek(), // 커스텀 함수 사용
        },
      },
      {
        sequelize,
        underscored: true,
        timestamps: true,
        paranoid: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

export default Point;
